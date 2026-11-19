# 2. Arquitectura del sistema

## 2.1 Vista general

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         APP WEB (Next.js)                                │
│   ┌──────────────┐   ┌──────────────────┐   ┌─────────────────────────┐  │
│   │  Chat/Prompt │   │ Revisión/Aprobar │   │ Dashboard de objetivos  │  │
│   └──────┬───────┘   └────────┬─────────┘   └───────────┬─────────────┘  │
└──────────┼────────────────────┼─────────────────────────┼────────────────┘
           │                    │                         │
           ▼                    ▼                         ▲
┌──────────────────────────────────────────────────────────────────────────┐
│                   ORQUESTADOR (Claude Agent SDK)                         │
│  estado del pipeline · colas · reintentos · presupuesto · aprobaciones   │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────────────────────┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
 [A1]   [A2]   [A3]   [A4]   [A5]   [A6]   [A7]   [A8]        [A9]
 Trend  Analis Copy   Brand  Editor Evalua Viral  Publisher   Skill
 Scout  ta     writer Guard         dor    Oracle +Analytics  Curator
   │                           │                     │          (cron)
   ▼                           ▼                     ▼
┌──────────────┐   ┌──────────────────────┐   ┌────────────────────────┐
│ Fuentes de   │   │ Skills & render      │   │ APIs redes sociales    │
│ tendencias   │   │ Remotion · FFmpeg ·  │   │ TikTok · IG Graph ·    │
│ YouTube API ·│   │ TTS · Avatar · IA    │   │ YouTube Data/Analytics │
│ Apify · manual│  │ generativa (Higgsf.) │   │ · LinkedIn             │
└──────────────┘   └──────────────────────┘   └────────────────────────┘
           │                    │                         │
           ▼                    ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  DATOS: Postgres (Supabase) · Storage de vídeos (S3/R2) · pgvector       │
│  campañas · ideas · versiones · trazas de agentes · métricas · skills    │
└──────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Los agentes (resumen)

| ID | Agente | Rol en una frase | Modelo sugerido |
|----|--------|------------------|-----------------|
| A0 | **Orquestador / Producer** | Dirige el pipeline, reparte trabajo, controla costes y pide aprobaciones | Claude Opus |
| A1 | **Trend Scout** | Busca qué contenido funciona en los últimos 30 días para tema + industria + target | Claude Sonnet (+ Haiku para filtrar) |
| A2 | **Analista de Formatos** | Descompone los vídeos ganadores en patrones replicables (visual, narrativo, copy, venta) | Claude Opus (con visión) |
| A3 | **Copywriter** | Genera ≥10 guiones de 15–60 s con ángulos distintos | Claude Opus / Sonnet |
| A4 | **Brand Guardian** | Aplica y valida la identidad de marca en guiones y vídeos | Claude Sonnet |
| A5 | **Editor de Vídeo** | Convierte guión + brand kit en vídeo usando skills de edición | Claude Sonnet + skills |
| A6 | **Evaluador de Calidad** | Revisa el vídeo final (técnico, marca, guion, plataforma) y aprueba o devuelve | Claude Opus (visión) |
| A7 | **Viral Oracle** | Predice el potencial de viralidad y prioriza qué publicar | Modelo híbrido (LLM + estadístico) |
| A8 | **Publisher & Analytics** | Publica, recoge métricas y alimenta el aprendizaje | Haiku + código determinista |
| A9 | **Skill Curator** | Investiga, instala, mide y retira skills cada X tiempo | Claude Sonnet (programado) |

> El modelo concreto es configurable por agente (`config/agents.yaml`). Regla: Opus donde hay juicio creativo/analítico, Sonnet para ejecución, Haiku para clasificación masiva y barata.

## 2.3 Flujo de una campaña (de prompt a resultados)

```
Usuario: "Idea: por qué tu equipo comercial no usa el CRM.
          Industria: SaaS B2B. Target: directores comerciales España."
   │
   ▼
[A0] Crea Idea → carga Campaña (objetivo, marca, canales, presupuesto)
   │
   ▼
[A1] Trend Scout ── 30 días ── IG / LinkedIn / YouTube
   │   → trend_brief.json (30–100 vídeos de referencia + métricas + outliers)
   ▼
[A2] Analista ── descarga/inspecciona top N ── visión + transcripción
   │   → format_playbook.json (patrones, ganchos, estructuras, duración, estilo)
   ▼
[A3] Copywriter ── matriz de variantes ──
   │   → scripts.json (≥10 guiones: ángulo × formato × gancho × duración)
   ▼
[A4] Brand Guardian ── valida tono, mensajes, claims
   │   → scripts_aprobados.json  (+ brand_directives por versión)
   ▼
 ⏸ APROBACIÓN HUMANA (opcional) de guiones
   ▼
[A5] Editor ── elige skill por formato ── render
   │   → video_versions[] (mp4 9:16 maestro + subtítulos + miniatura)
   ▼
[A6] Evaluador ── checklist QA ── ¿OK? ─no─► vuelve a A5 (máx. 2 reintentos)
   │ sí
   ▼
[A7] Viral Oracle ── score 0–100 + justificación ── ranking
   │
   ▼
 ⏸ APROBACIÓN HUMANA de publicación (calendario propuesto)
   ▼
[A8] Publisher ── publica escalonado ── recoge métricas 1h/24h/72h/7d
   │
   ▼
Dashboard + memoria de aprendizaje ──► realimenta A1, A2, A3, A7 y A9
```

## 2.4 Matriz de variantes (cómo salen las 10 versiones)

Cada versión es una combinación de ejes. El Copywriter y el Orquestador eligen combinaciones **diversas** (no 10 casi iguales):

| Eje | Valores de ejemplo |
|-----|--------------------|
| **Ángulo** | Dolor, contraintuitivo/mito, historia personal, dato impactante, tutorial rápido, comparación antes/después, error común, opinión polémica, caso de cliente, humor |
| **Formato visual** | Talking head (tu cara o avatar), slideshow con motion, kinetic typography, dibujo/whiteboard, animación 2D, documental (b-roll + VO), meme-mix, screen recording, split-screen/reacción |
| **Gancho (0–3 s)** | Pregunta, afirmación provocadora, número, "deja de…", visual inesperado, POV, resultado primero |
| **Duración** | 15 s, 30 s, 45 s, 60 s |
| **Plataforma** | TikTok, Reels/IG, Shorts/YouTube, LinkedIn vídeo vertical |
| **CTA** | Seguir, comentar palabra clave, guardar, link en bio, DM |

Ejemplo: `V3 = Mito × Meme-mix × "Deja de…" × 30 s × Reels × Comentar palabra`.

Regla de diversidad: ninguna pareja de versiones comparte más de 3 de los 6 ejes.

## 2.5 Stack tecnológico recomendado

| Capa | Recomendación | Por qué |
|------|---------------|---------|
| Frontend | **Next.js + TypeScript + Tailwind + shadcn/ui** | Chat, revisión de vídeos y dashboard en un solo proyecto |
| Orquestación de agentes | **Claude Code** (fase interna, 0 €) → **Claude Agent SDK (TypeScript)** (SaaS) | Mismas definiciones de agentes; subagentes, skills y MCP nativos |
| Jobs largos | **Trigger.dev** o **Inngest** (o BullMQ + Redis) | Renders y scraping duran minutos; necesitas colas con reintentos |
| Render de vídeo | **Remotion** (vídeo como código React) + **FFmpeg** | Plantillas reutilizables de marca, render escalable (Remotion Lambda) |
| Voz | Chatterbox (MIT, local) en MVP · ElevenLabs u otro en producción | Clonación con consentimiento; 0 € en MVP |
| Avatar | Modelo open source en GPU gratuita (MVP) · HeyGen/Higgsfield u otros (producción) | Formato "avatar-lite": avatar en gancho y CTA (ver cap. 9) |
| Vídeo generativo | Higgsfield, Kling, Veo, Runway… vía API (fase 2–3) | B-roll y escenas que no puedes grabar |
| Transcripción | Whisper / Deepgram | Analizar vídeos de referencia y generar subtítulos |
| Base de datos | **Supabase (Postgres + Auth + Storage)** + pgvector | Relacional + búsquedas por similitud de patrones |
| Almacenamiento vídeo | Cloudflare R2 o S3 | Barato para muchos MP4 |
| Observabilidad | Langfuse o similar | Trazas por agente, costes y evaluaciones |

## 2.6 Estructura del repositorio

```
Growth-Video-Generator/
├── README.md                  ← punto de entrada
├── docs/                      ← esta documentación (y el PDF)
├── agents/                    ← definición de cada subagente (rol, prompt, contrato)
├── schemas/                   ← contratos JSON entre agentes
├── config/                    ← campaña, brand kit, agentes, canales (ejemplos)
├── skills/
│   └── registry/              ← catálogo de skills y su ciclo de vida
├── apps/
│   └── web/                   ← Next.js: chat, revisión, dashboard
├── services/
│   ├── orchestrator/          ← pipeline con Claude Agent SDK
│   ├── workers/               ← jobs: scraping, render, métricas
│   └── integrations/          ← conectores IG / YouTube / LinkedIn / proveedores
└── scripts/                   ← utilidades (p. ej. generar el PDF)
```

## 2.7 Estado y tolerancia a fallos

- Cada paso del pipeline es un **job idempotente** con estado: `pending → running → needs_review → done | failed`.
- El Orquestador guarda un **checkpoint** tras cada agente: si el render falla, no se repite la investigación.
- Reintentos con *backoff*; si un agente falla 3 veces, la tarea queda en `needs_review` y te avisa.
- **Presupuesto por campaña**: cada llamada a un proveedor de pago registra su coste; si se supera el límite, el Orquestador degrada a formatos baratos o pausa.
