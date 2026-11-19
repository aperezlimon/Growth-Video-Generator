# 7. Roadmap: qué hacer, paso a paso

Principio: **validar el valor antes de automatizarlo todo.** Primero conseguir que el sistema produzca vídeos que funcionan (aunque publiques a mano); después automatizar publicación y aprendizaje.

## Fase 0 · Preparación (semana 1)

- [ ] **Definir la marca:** completa `config/brand-kit.example.yaml` (colores, tipografías, tono, logo, 5 vídeos que te encantan y 5 que no).
- [ ] **Definir la primera campaña:** completa `config/campaign.example.yaml` (industria, target, objetivo North Star, canales, presupuesto).
- [ ] **Cuentas y accesos:**
  - Instagram como cuenta **Business/Creator** vinculada a una página de Facebook; crear app en Meta for Developers.
  - Proyecto en Google Cloud con YouTube Data API v3 y YouTube Analytics API.
  - App en LinkedIn Developers (solicitar los productos de publicación).
  - Claves: Anthropic API, Apify (o similar), ElevenLabs; Supabase; Cloudflare R2/S3.
- [ ] **Baseline:** anota seguidores y vistas medias actuales por canal.
- [ ] **Lista de referentes:** 20–30 cuentas del nicho (competidores y creadores que admiras) por plataforma.

**Entregable:** campaña y marca definidas, accesos listos.

## Fase 1 · Pipeline "cerebro" sin vídeo (semanas 2–3)

Objetivo: de un prompt a **10 guiones excelentes** con evidencia.

- [ ] Montar el **Orquestador** con Claude Agent SDK y los contratos de `schemas/`.
- [ ] **A1 Trend Scout:** YouTube API + un actor de Apify para Instagram; LinkedIn vía lista de referentes.
- [ ] **A2 Analista:** descarga, fotogramas (FFmpeg), transcripción (Whisper) y análisis con visión.
- [ ] **A3 Copywriter** + **A4 Brand Guardian** con la matriz de variantes.
- [ ] Interfaz mínima: CLI o chat sencillo que muestre el `trend_brief`, el `playbook` y los guiones.
- [ ] **Validación humana:** revisa 3 ideas completas. ¿Las referencias son relevantes? ¿Los guiones los publicarías?

**Criterio de salida:** ≥7 de cada 10 guiones te parecen publicables.

## Fase 2 · Investigación de skills y primeros vídeos (semanas 3–5)

- [ ] **Investigación de skills** (cap. 4.3): banco de pruebas con el mismo guion; scorecard.
- [ ] Elegir **3 formatos iniciales baratos y de alta calidad**, p. ej.:
  1. Kinetic typography / slideshow con motion (Remotion).
  2. Talking head grabado por ti + auto-edición (cortes, zooms, subtítulos).
  3. Meme-mix con biblioteca curada.
- [ ] Crear **plantillas Remotion de marca** para esos 3 formatos (parametrizadas por el brand kit).
- [ ] **A5 Editor** + **A6 Evaluador** con el checklist de QA.
- [ ] Generar 3 ideas × 10 versiones = 30 vídeos.

**Criterio de salida:** ≥60 % de los vídeos pasan QA sin intervención y te parecen al nivel de tus referentes.

## Fase 3 · Publicación y medición (semanas 5–8)

- [ ] Publicación **manual asistida** (el sistema prepara todo; tú subes) o vía agregador.
- [ ] Conectar **YouTube Analytics** e **Instagram Insights** para leer métricas automáticamente; LinkedIn manual/CSV.
- [ ] **A8** con snapshots a 1 h / 24 h / 72 h / 7 d.
- [ ] **Dashboard v1:** objetivo, pipeline y tabla de rendimiento.
- [ ] **A7 Viral Oracle** fase 1 (heurístico) y registrar sus predicciones para calibrar.
- [ ] Ritmo: 1–2 publicaciones/día por canal.

**Criterio de salida:** ~50–100 vídeos publicados con métricas → datos suficientes para aprender.

## Fase 4 · Bucle de aprendizaje (semanas 8–12)

- [ ] **Memoria de aprendizajes:** insights por eje y plataforma que se inyectan en A1–A3.
- [ ] **Skill Curator (A9)** programado cada 2 semanas con informe de uso/rendimiento/fatiga.
- [ ] **Viral Oracle fase 2:** modelo entrenado con tus datos; comparar con el heurístico.
- [ ] Añadir formatos caros solo para ideas ganadoras: avatar con tu cara, documental con B-roll generativo, 2D/dibujo.
- [ ] Publicación automática con aprobación (IG y YouTube).

## Fase 5 · Escala (mes 4+)

- [ ] Multi-marca / multi-cliente (si quieres convertirlo en producto o agencia).
- [ ] Programación por hora óptima, reciclado de ganadores, Trial Reels sistemáticos.
- [ ] A/B de miniaturas y primeros 3 s.
- [ ] Panel de costes y ROI.

## Resumen visual

```
Sem:  1     2     3     4     5     6     7     8     9    10    11    12
F0  ████
F1        ██████████
F2              ████████████
F3                          ████████████████
F4                                            ████████████████████
```

## Tu primer día (acciones concretas)

1. Lee los capítulos 1 y 2 de este documento.
2. Rellena `config/brand-kit.example.yaml` y `config/campaign.example.yaml` (cópialos sin `.example`).
3. Crea la lista de 20–30 referentes por canal en `config/references.example.yaml`.
4. Abre las cuentas de desarrollador (Meta, Google Cloud, LinkedIn) — la aprobación tarda días, empieza ya.
5. Elige 3 ideas de contenido para el primer ciclo de prueba.
