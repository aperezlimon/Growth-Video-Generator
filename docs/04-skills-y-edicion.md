# 4. Skills de edición y ciclo de vida (Skill Registry)

## 4.1 Qué es una "skill" en este sistema

Una **skill** es un paquete reutilizable (carpeta con `SKILL.md` + scripts/plantillas) que un agente carga cuando la necesita. En el ecosistema de Claude (Claude Code / Agent SDK) las skills son nativas: el agente lee las instrucciones y ejecuta sus scripts. Esto encaja con tu preferencia: **priorizar skills** y usar proveedores externos solo donde aporten algo que no se puede hacer en local (avatar con tu cara, vídeo generativo).

Tres tipos:

| Tipo | Ejemplo | Coste | Control |
|------|---------|-------|---------|
| **Skill local** (código + instrucciones) | Plantillas Remotion, FFmpeg, subtítulos animados, Manim | Muy bajo (cómputo) | Total |
| **Skill-wrapper de API** | Skill que llama a ElevenLabs, HeyGen, Higgsfield, generador de imágenes | Por uso | Medio |
| **Conector MCP** | Servidores MCP de terceros (stock, música, diseño) | Variable | Medio |

## 4.2 Mapa formato visual → pipeline de skills (punto de partida)

> ⚠️ Lista de **candidatos a validar** en la fase de investigación (semana 2–3 del roadmap). El mercado cambia cada mes; el Skill Curator la mantiene viva.

| Formato visual | Pipeline propuesto | Coste relativo |
|----------------|--------------------|----------------|
| **Kinetic typography / slideshow con motion** | Remotion (+ skills oficiales de Remotion para agentes) · plantillas de marca · TTS | € |
| **Dibujo / whiteboard** | Generación de ilustraciones en estilo fijo + animación de trazo (SVG path animation en Remotion) | €€ |
| **Animación 2D / explainer** | Remotion + Lottie, o Manim para conceptos/diagramas animados | € – €€ |
| **Documental** (B-roll + voz en off) | Stock con licencia (Pexels/Storyblocks…) o B-roll generativo (Higgsfield/Kling/Veo) + VO + subtítulos | €€ – €€€ |
| **Talking head con tu cara (grabado)** | Tú grabas en bruto → skill de auto-edición: cortes de silencios, zoom dinámico, subtítulos, B-roll insertado | € |
| **Avatar-lite** (avatar en gancho + CTA, resto motion) | Modelo open source de avatar + Chatterbox TTS + plantilla Remotion | € (GPU) |
| **Talking head con avatar/clon completo** | HeyGen / Higgsfield / similar (con tu consentimiento) + plantilla de marca encima | €€€ |
| **Meme-mix (comedia)** | Biblioteca de memes curada + plantillas re-creadas + SFX + cortes rápidos en Remotion | € |
| **Screen recording / demo** | Grabación + zoom automático + cursor resaltado + subtítulos | € |
| **Split-screen / reacción** | Composición Remotion con vídeo de referencia (con permiso) o recreado | € – €€ |

**Skills transversales** (todos los formatos): transcripción (Whisper), subtítulos animados estilo "palabra resaltada", normalización de audio, música con licencia, generación de portada, exportación multiformato, marca de agua/firma de marca.

## 4.3 Investigación inicial (MVP)

Objetivo: elegir **un stack mínimo** que cubra 3–4 formatos con calidad alta.

1. **Inventario:** listar candidatos por categoría (motion, subtítulos, voz, avatar, generativo, stock, memes, música).
2. **Banco de pruebas:** el mismo guion de 30 s renderizado con cada candidato.
3. **Scorecard** (1–5 cada criterio):
   - calidad visual, control/consistencia de marca, coste por vídeo, velocidad, facilidad de automatización (API/skill), licencia de uso comercial, estabilidad del proveedor.
4. Elegir **1 opción principal + 1 de respaldo** por categoría.
5. Registrar todo en `skills/registry/registry.yaml`.

## 4.4 Ciclo de vida de una skill

```
 candidate ──(prueba OK)──► trial ──(≥N usos, métricas OK)──► active
     ▲                                                          │
     │                                    (bajo uso / bajo rendimiento /
     │                                     fatiga / proveedor peor que alternativa)
     │                                                          ▼
 (Curator busca reemplazo) ◄─────────────── deprecated ◄──── under_review
                                                │
                                                ▼
                                             retired
```

## 4.5 Revisión periódica (cada 2 semanas, configurable)

El **Skill Curator (A9)** ejecuta:

1. **Uso:** ¿cuántas versiones usaron la skill en el periodo? → si 0 usos en 2 ciclos → `under_review`.
2. **Rendimiento:** rendimiento medio (vistas normalizadas, retención) de los vídeos hechos con la skill vs. la media. Si está por debajo del percentil 30 durante 2 ciclos → `under_review`.
3. **Fatiga:** si el rendimiento de un formato cae ≥25 % respecto a sus primeras semanas, aunque siga por encima de la media → marcar fatiga y proponer variación o reemplazo.
4. **Mercado:** búsqueda de nuevas skills/herramientas (repositorios de skills, MCP registry, lanzamientos de proveedores) → nuevas `candidate`.
5. **Coste:** si una alternativa da calidad equivalente a ≤50 % de coste → proponer cambio.
6. **Informe:** `skill_review_report` en el dashboard con propuestas; tú apruebas altas/bajas.

## 4.6 Biblioteca de memes y elementos reconocibles

El formato meme es muy potente para "momentos de desconexión" cómicos, pero es el de más riesgo legal:

- **Recomendado:** plantillas de meme ampliamente reutilizadas (imágenes estáticas tipo *reaction*), recreaciones propias de formatos de meme, stickers/GIFs de plataformas con licencia de integración, ilustraciones propias "en estilo meme".
- **Evitar:** clips de películas/series/deportes y música comercial sin licencia → Content ID, *strikes* y retirada.
- Cada meme en la biblioteca lleva `licencia`, `fuente`, `riesgo (bajo/medio/alto)`, `etiquetas de emoción` (sorpresa, frustración, victoria…) para que el Copywriter los pida por emoción: `meme_slot: "frustración"`.
