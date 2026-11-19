# 3. Subagentes en detalle

Para cada agente: **misión, entradas, proceso, salidas, herramientas/skills, criterios de calidad y métricas**. Las definiciones ejecutables (prompt de sistema) están en `agents/`. Los contratos de datos en `schemas/`.

---

## A0 · Orquestador / Producer

**Misión:** convertir un prompt en un plan de producción, ejecutarlo y entregar resultados dentro de presupuesto.

- **Entradas:** prompt del chat, campaña activa (`config/campaign.example.yaml`), brand kit, histórico de resultados.
- **Proceso:**
  1. Interpreta el prompt → extrae *tema, industria, target, objetivo, canales* (si falta algo, pregunta).
  2. Crea la `Idea` y planifica la matriz de variantes.
  3. Lanza agentes en orden, valida cada salida contra su esquema, gestiona reintentos.
  4. Pide aprobaciones humanas según configuración.
  5. Registra costes y trazas.
- **Salidas:** `production_plan.json`, estado en tiempo real en el dashboard.
- **Métricas:** tiempo prompt→vídeos listos, coste por versión, % de pasos sin reintento.

---

## A1 · Trend Scout (buscador de tendencias)

**Misión:** encontrar los vídeos cortos que mejor están funcionando **en los últimos 30 días** para el tema, la industria y el público objetivo, en Instagram, LinkedIn y YouTube.

- **Entradas:** tema, industria, target (rol, país, idioma), lista opcional de cuentas referentes y competidores, palabras clave negativas.
- **Proceso:**
  1. **Expansión de búsqueda:** genera keywords, hashtags, temas relacionados y cuentas semilla (en el idioma del target y en inglés).
  2. **Recolección por canal** (ver cap. 5):
     - YouTube: API oficial `search.list` con `publishedAfter = hoy-30d`, `videoDuration=short`, + `videos.list` para métricas.
     - Instagram: proveedores de scraping de Reels por hashtag/cuenta + Graph API *Business Discovery* para cuentas concretas.
     - LinkedIn: scraping de posts de vídeo por keyword/creadores + lista manual de creadores top del nicho.
  3. **Normalización:** cada vídeo → `vistas, likes, comentarios, compartidos, guardados (si hay), duración, fecha, seguidores de la cuenta`.
  4. **Detección de outliers:** lo importante no es lo más visto, sino lo que **rinde por encima de lo normal para esa cuenta**:
     `outlier_score = vistas_video / mediana_vistas_últimos_N_vídeos_de_la_cuenta`.
     Un vídeo con 50k vistas en una cuenta que suele hacer 2k (×25) es más replicable que uno con 2M en una cuenta que hace 1.5M.
  5. **Filtro de relevancia** (LLM barato): ¿encaja con tema y target? descarta ruido.
  6. Ranking final: `relevancia × outlier_score × engagement_rate × frescura`.
- **Salidas:** `trend_brief.json` — 30–100 vídeos, top 15–20 marcados para análisis profundo, con URL, métricas y por qué se eligió.
- **Criterios de calidad:** ≥3 fuentes/cuentas distintas, nada de más de 30 días, sin duplicados, idioma/mercado correctos.
- **Métricas del agente:** precisión de relevancia (revisada por ti en la fase 1), % de referencias que acaban inspirando versiones ganadoras.

---

## A2 · Analista de Formatos

**Misión:** entender **por qué** funcionan esos vídeos y convertirlo en un **playbook replicable**.

- **Entradas:** top 15–20 vídeos del `trend_brief` (archivo o fotogramas + transcripción + métricas).
- **Proceso** (por vídeo, luego síntesis):
  - **Estructura temporal:** gancho (0–3 s), desarrollo, giro, payoff, CTA; cortes por segundo; duración total.
  - **Visual:** formato (talking head, slideshow, 2D, documental, meme…), encuadre, paleta, tipografías (familia, peso, tamaño, posición, animación), subtítulos (estilo, palabras resaltadas), gráficos/iconos, B-roll, transiciones, uso de memes.
  - **Audio:** voz (persona/IA, ritmo de habla en palabras/min), música (tendencia/ambiente), efectos de sonido.
  - **Copy:** tipo de gancho, fórmulas (PAS, AIDA, antes/después, lista, "nadie te dice…"), palabras de poder, texto en pantalla vs. hablado, caption y hashtags.
  - **Ángulo de venta y approach:** educativo, aspiracional, miedo a perderse algo, autoridad, prueba social, contrarian; cómo se introduce la oferta (soft/hard).
  - **Storytelling:** arquetipo (héroe, mentor, villano = problema), tensión, conflicto, resolución.
  - **Conexión y engagement:** qué provoca comentarios (pregunta abierta, polémica, palabra clave), guardados (valor de referencia), compartidos (identificación, humor).
  - **Diferencias por plataforma:** qué cambia entre LinkedIn (más profesional, más texto) vs. Reels/Shorts.
- **Salidas:** `format_playbook.json` con:
  - `patterns[]`: patrón, evidencia (vídeos que lo usan), impacto estimado.
  - `hook_library[]`: ganchos literales y plantillas.
  - `visual_specs[]`: specs replicables (tipografía, ritmo, subtítulos, paleta).
  - `do / dont` por plataforma.
- **Herramientas:** descarga de vídeo, extracción de fotogramas (FFmpeg), transcripción (Whisper), Claude con visión.
- **Métricas:** correlación entre patrones recomendados y rendimiento real de tus vídeos.

---

## A3 · Copywriter

**Misión:** escribir **≥10 guiones** de 15–60 s para la idea, cada uno con un ángulo y formato distinto según la matriz de variantes.

- **Entradas:** idea, `format_playbook`, brand kit (voz y tono), objetivo de la campaña, aprendizajes previos (qué ganchos te funcionaron).
- **Proceso:**
  1. Propone la matriz de 10+ combinaciones (respetando la regla de diversidad).
  2. Para cada versión escribe un guion **por escenas/beats** con tiempos.
  3. Auto-revisión: ¿el gancho se entiende sin sonido? ¿hay una sola idea? ¿el CTA encaja con el objetivo?
- **Salida por guion** (`scripts.json`):
  - `hook` (texto hablado + texto en pantalla + indicación visual)
  - `beats[]`: `t_start, t_end, voiceover, on_screen_text, visual_direction, sfx/music, meme_slot`
  - `cta`, `caption` por plataforma, `hashtags`, `duración objetivo`, `formato visual`.
- **Reglas:** 2–3 palabras por segundo de voz; texto en pantalla ≤ 7 palabras por bloque; primera frase ≤ 3 s; el payoff debe llegar antes del 80 % del vídeo.
- **Métricas:** retención a 3 s y media de visualización de los vídeos de cada tipo de gancho.

---

## A4 · Brand Guardian (experto en imagen y marca)

**Misión:** que **todas** las versiones, por distintas que sean, se reconozcan como tuyas.

- **Entradas:** guiones, brand kit (`config/brand-kit.example.yaml`), vídeos renderizados (segunda pasada).
- **Qué define/vigila:**
  - **Identidad visual fija ("activos distintivos"):** paleta, 1–2 tipografías, estilo de subtítulos, logo/marca de agua, intro/outro de ≤1 s, una "firma" recurrente (frase, sonido, gesto, color de fondo).
  - **Identidad verbal:** tono, vocabulario permitido/prohibido, cómo te diriges al público (tú/usted), claims que no se pueden hacer.
  - **Sistema de plantillas:** cada formato visual (slideshow, meme-mix, documental…) tiene su plantilla Remotion parametrizada con el brand kit → variedad de formato, consistencia de marca.
- **Proceso:** puntúa cada guion/vídeo (0–100) en consistencia; devuelve correcciones concretas; bloquea si hay claims arriesgados.
- **Salidas:** `brand_review.json` (score, issues, `brand_directives` para el editor).
- **Métricas:** reconocimiento de marca (encuestas/comentarios), consistencia media, nº de correcciones por versión.

---

## A5 · Editor de Vídeo

**Misión:** convertir cada guion aprobado en un vídeo de alta calidad, en los formatos de cada plataforma.

- **Entradas:** guion, `brand_directives`, assets (logo, fotos, clips propios, tu voz/avatar), skills disponibles del *Skill Registry*.
- **Proceso:**
  1. **Selección de skill/pipeline** según el formato visual (ver tabla del cap. 4).
  2. **Assets:** genera voz (TTS con tu voz clonada), busca B-roll (librerías con licencia o generativo), selecciona memes de la biblioteca curada, genera imágenes/ilustraciones.
  3. **Montaje:** composición en Remotion (plantilla de marca) → subtítulos animados → música/SFX → render.
  4. **Exportación multiformato:** 9:16 (Reels/Shorts), 1:1 o 4:5 (LinkedIn/feed), 16:9 si procede; miniatura/portada; archivo SRT.
- **Salidas:** `video_version.json` + archivos en storage (`mp4`, `srt`, `jpg`).
- **Reglas técnicas:** 1080×1920, 30 fps, -14 LUFS de audio, zona segura para la UI de cada red (sin texto en el 15 % inferior/superior), subtítulos siempre.
- **Métricas:** tiempo y coste de render, tasa de rechazo del Evaluador.

---

## A6 · Evaluador de Calidad

**Misión:** que no salga nada mediocre. Actúa como un director creativo exigente.

- **Entradas:** vídeo renderizado (fotogramas clave + audio transcrito), guion original, brand review, specs de plataforma.
- **Checklist (cada punto puntúa):**
  - Técnico: resolución, audio sin clipping, subtítulos sincronizados, zonas seguras, sin artefactos de IA visibles (manos, texto deformado).
  - Gancho: ¿engancha en 1–3 s sin audio?
  - Claridad: ¿una idea, se entiende a la primera?
  - Marca: ¿se reconoce la marca en 2 s?
  - Ritmo: cambios visuales cada 1–3 s, sin "baches".
  - Cumplimiento: derechos (música, memes), etiquetado IA, claims.
- **Salidas:** `qa_report.json` — `pass | revise | reject`, lista de correcciones accionables para el Editor (máximo 2 iteraciones).
- **Métricas:** concordancia entre el veredicto del Evaluador y tu juicio; correlación score-rendimiento.

---

## A7 · Viral Oracle (previsión de viralidad)

**Misión:** estimar el potencial de cada versión **antes** de publicar y priorizar.

- **Fase 1 (sin datos propios):** score heurístico 0–100 basado en:
  - similitud con patrones ganadores del `format_playbook` (embeddings),
  - fuerza del gancho (rúbrica LLM),
  - adecuación de duración/plataforma,
  - novedad respecto a lo ya publicado (evitar fatiga),
  - calidad del Evaluador.
- **Fase 2 (con ≥50–100 vídeos publicados):** modelo estadístico (p. ej. gradient boosting) entrenado con tus resultados reales: features del guion/vídeo → retención, vistas a 7 días, engagement. El LLM explica, el modelo predice.
- **Salidas:** `virality_forecast.json` — score, rango esperado de vistas, confianza, razones, recomendación de canal y hora.
- **Métricas:** error de predicción (MAE en log-vistas), ranking correcto (¿el top-3 previsto está en el top-3 real?).

---

## A8 · Publisher & Analytics

**Misión:** publicar en el momento óptimo y traer los datos de vuelta.

- **Publicación:** calendario escalonado (no las 10 versiones el mismo día en la misma cuenta). Estrategias:
  - Instagram **Trial Reels** para testear variantes con no seguidores y publicar después la ganadora.
  - Distribuir variantes entre IG, YouTube Shorts y LinkedIn.
  - Re-publicar ganadoras con nuevo gancho en semanas posteriores.
- **Recogida de métricas:** a 1 h, 24 h, 72 h y 7 días: vistas, alcance, retención media, % visto completo, likes, comentarios, compartidos, guardados, nuevos seguidores atribuibles, clics.
- **Aprendizaje:** escribe en la memoria qué ejes (ángulo, formato, gancho, duración) ganan por plataforma → alimenta A1, A2, A3, A7.
- **Salidas:** `performance_snapshot.json`, actualización del dashboard.

---

## A9 · Skill Curator (mantenimiento de skills)

**Misión:** mantener el arsenal de edición actualizado, útil y sin fatiga.

- Se ejecuta **programado** (sugerido: cada 2 semanas) y bajo demanda.
- Detalle completo en el capítulo 4.
