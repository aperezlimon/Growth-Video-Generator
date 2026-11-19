# 1. Visión y análisis del planteamiento

## 1.1 Qué es el producto

**Growth Video Generator (GVG)** es una aplicación con una interfaz de chat donde, a partir de un único prompt ("quiero hablar de X para la industria Y, dirigido al público Z"), se activa una **cadena de subagentes especializados** que:

1. Investigan qué formatos de vídeo corto están funcionando **en los últimos 30 días** en TikTok, Instagram (Reels), YouTube (Shorts) y LinkedIn (vídeo vertical) para ese tema, industria y público objetivo.
2. Analizan esos vídeos (formato, ritmo, tipografía, gráficos, duración, estructura narrativa, recursos de copy, ángulos de venta, ganchos de engagement).
3. Escriben guiones de 15–60 segundos.
4. Los pasan por un filtro de identidad de marca.
5. Los editan y renderizan usando *skills* de edición (Remotion, etc.) o proveedores externos (Higgsfield, HeyGen…).
6. Los evalúan (calidad + predicción de viralidad) antes de publicar.
7. Los publican y miden en las redes, cerrando el bucle de aprendizaje.
8. Todo ello visible en un **dashboard** que sigue el progreso hacia un objetivo fijado al inicio (seguidores, visualizaciones, etc.).

**La gracia:** de **1 idea → ≥10 versiones** que atacan ángulos distintos y formatos visuales distintos (dibujo, 2D, documental, slideshow con motion, tu cara/avatar, memes…), para **masificar contenido** y aprender rápido qué funciona.

## 1.2 Lo que está muy bien planteado

- **Separación de responsabilidades por agente.** Cada subagente tiene un rol acotado, inputs y outputs claros. Esto permite mejorar, sustituir o evaluar cada pieza por separado.
- **Bucle de retroalimentación real.** No es solo "generar vídeos", sino medir resultados y ajustar. Esto es lo que diferencia una fábrica de contenido de una máquina de crecimiento.
- **Volumen de variantes.** 10 versiones por idea es la forma correcta de hacer *creative testing*: el algoritmo decide, no la intuición.
- **Gestión de la fatiga.** La revisión periódica de skills y formatos es clave: los formatos virales caducan en semanas.
- **Coherencia de marca como capa transversal.** Es lo que hace que el volumen sume reconocimiento en vez de dispersarlo.

## 1.3 Huecos y ajustes que propongo

| # | Punto | Riesgo si no se aborda | Propuesta |
|---|-------|------------------------|-----------|
| 1 | **Falta un Orquestador** | Los agentes no saben cuándo actuar, qué reintentar ni cuándo parar | Añadir un *Orchestrator / Producer* que gestiona el pipeline, estado y costes |
| 2 | **Acceso a datos de tendencias** | Las APIs oficiales **no permiten** buscar libremente contenido ajeno en Instagram ni LinkedIn | Combinar APIs oficiales (YouTube Data API) + proveedores de scraping (Apify u otros) + input manual de referentes. Ver cap. 5 |
| 3 | **Predicción de viralidad sin datos propios** | Al inicio el "evaluador de viralidad" sería una opinión de un LLM sin calibrar | Fase 1: puntuación heurística basada en patrones de los vídeos analizados. Fase 2: modelo calibrado con tus resultados reales |
| 4 | **Human-in-the-loop** | Publicar automáticamente contenido de baja calidad o fuera de marca daña la cuenta | Puntos de aprobación configurables: guion, vídeo final, publicación |
| 5 | **Memes y elementos reconocibles** | Derechos de autor (clips de películas, series, música) → bloqueos, *strikes* o retirada | Biblioteca de memes curada/licenciada, plantillas de meme "re-creadas", audio de librerías con licencia |
| 6 | **Uso de tu cara (avatar/clon)** | Consentimiento, deepfake, etiquetado de contenido IA obligatorio en las plataformas | Clon solo de tu persona, con consentimiento explícito, y marcar "contenido generado con IA" donde la plataforma lo exija |
| 7 | **10 versiones de la misma idea en la misma cuenta** | Canibalización, sensación de spam y penalización por contenido repetido | Publicar variantes escalonadas, en canales distintos, o como *Trial Reels* de Instagram (se muestran a no seguidores) |
| 8 | **Coste por vídeo** | Generación de vídeo IA + voz + avatar puede costar varios euros por versión | Presupuesto por campaña, *routing* a formatos baratos (slideshow/motion) y caros (avatar/IA generativa) según el potencial |
| 9 | **Definir el "objetivo"** | Sin una métrica norte el sistema optimiza mal (vistas vs. leads) | En el *onboarding* se elige un North Star (seguidores, vistas, engagement rate, leads) + fecha objetivo |
| 10 | **Evaluación de los propios agentes** | No sabes qué agente está fallando | Registrar inputs/outputs de cada paso (trazas) y evaluar cada agente con métricas propias |

## 1.4 Principios de diseño

1. **Contratos antes que prompts.** Cada agente entrega un JSON con esquema validado (carpeta `schemas/`). Si no valida, se reintenta.
2. **Todo es versionable.** Ideas, guiones, versiones de vídeo, skills y resultados quedan registrados con su linaje (de qué tendencia vino, qué guion, qué skill).
3. **Datos > opinión.** Cada decisión creativa cita la evidencia (vídeos de referencia y métricas) que la justifica.
4. **Barato primero, caro después.** Se prototipa con formatos baratos; solo los ganadores se escalan a formatos caros.
5. **El humano decide lo irreversible.** Publicar y gastar por encima de un umbral siempre pasa por aprobación (configurable).

## 1.5 Glosario

- **Campaña:** objetivo + marca + público + periodo. Contiene ideas.
- **Idea:** concepto central de contenido. Genera ≥10 versiones.
- **Versión / Variante:** combinación concreta de *ángulo × formato visual × gancho × duración × plataforma*.
- **Brief de tendencias:** salida del Trend Scout (vídeos de referencia con métricas).
- **Playbook de formato:** salida del Analista (patrones replicables).
- **Brand Kit:** identidad visual y verbal de la marca (colores, tipografías, logo, tono, plantillas).
- **Skill:** capacidad instalable que un agente usa para ejecutar una tarea (p. ej. una skill de Remotion para animar textos).
- **Skill Registry:** catálogo de skills con su estado, uso y rendimiento.
