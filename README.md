# Growth Video Generator

Sistema de subagentes que, a partir de un prompt en un chat, investiga tendencias (Instagram, LinkedIn, YouTube · últimos 30 días), analiza formatos ganadores, escribe guiones de 15–60 s, aplica tu identidad de marca, edita vídeos con skills, evalúa calidad y viralidad, publica y mide — generando **≥10 versiones por idea** y siguiendo tu progreso hacia un objetivo en un dashboard.

```
Prompt → Trend Scout → Analista → Copywriter → Brand Guardian → Editor → Evaluador → Viral Oracle → Publisher & Analytics
                ▲                                                                                        │
                └──────────────────────── aprendizajes + Skill Curator (cada 14 días) ◄──────────────────┘
```

## Documentación

| # | Documento |
|---|-----------|
| 1 | [Visión y análisis](docs/01-vision-y-analisis.md) |
| 2 | [Arquitectura](docs/02-arquitectura.md) |
| 3 | [Subagentes en detalle](docs/03-subagentes.md) |
| 4 | [Skills de edición y ciclo de vida](docs/04-skills-y-edicion.md) |
| 5 | [Integraciones con redes](docs/05-integraciones-redes.md) |
| 6 | [Datos y dashboard](docs/06-datos-y-dashboard.md) |
| 7 | [Roadmap paso a paso](docs/07-roadmap-paso-a-paso.md) |
| 8 | [Costes y riesgos](docs/08-costes-riesgos.md) |

PDF completo: [`docs/Growth-Video-Generator.pdf`](docs/Growth-Video-Generator.pdf) (regenerar con `node scripts/build_pdf.js`).

## Estructura

```
agents/      definición de cada subagente (rol, modelo, herramientas, contrato)
schemas/     contratos JSON entre agentes
config/      campaña, brand kit, referentes y modelos por agente (ejemplos)
skills/      Skill Registry y política de revisión
apps/web     chat, revisión y dashboard (Next.js)
services/    orquestador, workers e integraciones
scripts/     utilidades (generación del PDF)
```

## Empezar

1. Lee `docs/07-roadmap-paso-a-paso.md` → sección "Tu primer día".
2. Copia y rellena `config/*.example.yaml`.
3. Abre cuentas de desarrollador (Meta, Google Cloud, LinkedIn).
