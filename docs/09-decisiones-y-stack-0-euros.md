# 9. Decisiones tomadas y su impacto

## 9.1 Registro de decisiones

| # | Decisión | Elección | Impacto principal |
|---|----------|----------|-------------------|
| D1 | Uso | **Producto para terceros (SaaS)**. Tú eres el primer cliente | Multi-cliente (multi-tenant) desde el diseño, aunque al principio solo estés tú |
| D2 | Canales | **Solo vídeo vertical**: TikTok, Instagram Reels, YouTube Shorts, vídeo vertical de LinkedIn | Se añade **TikTok**. Un único formato maestro 9:16 |
| D3 | Autonomía | **Apruebas guiones y publicación** | Dos pantallas de aprobación en el MVP |
| D4 | Presentador | **Avatar** en vez de grabarte | Es la pieza más cara. Choca con D5 (ver 9.5) |
| D5 | Presupuesto MVP | **0 €** | Stack gratuito/open source, ejecución local y publicación manual asistida (ver 9.6) |

## 9.2 D1 · Diseñado como SaaS multi-cliente desde el día 1

No hace falta construir todo el SaaS ahora, pero sí **tomar las decisiones de datos que evitan rehacerlo después**:

- **Workspace (tenant)** como entidad raíz: `workspace → brands → campaigns → ideas → versions`. Tú eres el workspace nº 1.
- **Aislamiento de datos:** cada tabla lleva `workspace_id`, con Row Level Security en Postgres/Supabase.
- **Tokens de redes sociales por workspace**, cifrados. Cada cliente conecta sus propias cuentas.
- **Contador de uso y costes por workspace** desde el principio (tokens LLM, segundos de render, segundos de avatar). Servirá para fijar precios y para cobrar.
- **BYOK (Bring Your Own Key):** opción de que el cliente use sus propias claves (Anthropic, proveedor de avatar). Te protege el margen y encaja con el presupuesto de 0 €.
- **Consentimiento de avatar/voz por workspace:** registro firmado (quién, cuándo, para qué) antes de clonar a nadie. Es obligatorio para venderlo a terceros.
- **Auditorías de las apps de las plataformas.** Para publicar en nombre de clientes necesitas apps aprobadas por Meta, TikTok, Google y LinkedIn. Son gratuitas, pero tardan semanas. Empieza el trámite pronto (fase 4 del roadmap).

## 9.3 D2 · Vertical-first (se añade TikTok)

**Formato maestro único:** 1080×1920, 9:16, 30 fps, subtítulos incrustados y un SRT aparte. Se eliminan los renders 1:1 y 16:9, lo que simplifica el editor y reduce el coste de render.

| Canal | Duración objetivo | Particularidades |
|-------|-------------------|------------------|
| TikTok | 15–60 s | El más sensible a tendencias de audio y a los primeros 1–2 s |
| Instagram Reels | 15–60 s | Trial Reels para testear variantes con no seguidores |
| YouTube Shorts | 15–60 s | Mejor fuente de datos de tendencias vía API oficial |
| LinkedIn vertical | 30–60 s | Tono más profesional; el copy del post pesa más |

**TikTok en el sistema:**

- **Tendencias:** no hay API pública de búsqueda para productos comerciales (la Research API es para investigación académica). Fuentes: TikTok Creative Center (tendencias, hashtags y audios, consulta web), proveedores de scraping y lista de cuentas de referencia.
- **Publicar:** Content Posting API. Hasta superar la auditoría de TikTok, una app **solo puede publicar en modo privado** y para un máximo de 5 usuarios en 24 h. Para un SaaS la auditoría es imprescindible. Mientras tanto, publicación manual asistida.
- **Métricas:** Display API (vistas, likes, comentarios y compartidos de tus propios vídeos), con importación manual como respaldo.

## 9.4 D3 · Doble aprobación

1. **Aprobación de guiones:** llegan los 10+ guiones como tarjetas. Para cada uno puedes:
   - aprobar,
   - editar en línea,
   - pedir "regenerar este" con un comentario,
   - descartar.

   Solo se renderiza lo aprobado, así no gastas en vídeos que no quieres.
2. **Aprobación de publicación:** ves el vídeo final, su informe de calidad, la previsión de viralidad y un calendario propuesto por canal. Apruebas, mueves fechas o rechazas.

Cada comentario que haces al aprobar o rechazar se guarda como aprendizaje y se inyecta al Copywriter y al Evaluador en los ciclos siguientes.

## 9.5 D4 · Avatar con presupuesto 0 €: el conflicto y cómo resolverlo

Un avatar de calidad tiene un coste real: o pagas a un proveedor (HeyGen, Higgsfield…) o pagas GPU para ejecutar un modelo abierto. Opciones:

| Opción | Coste | Calidad | Uso recomendado |
|--------|-------|---------|-----------------|
| **A. Modelo open source en GPU gratuita** (p. ej. LongCat-Video-Avatar, daVinci-MagiHuman; licencias a verificar en cada repositorio) | 0 € (cuotas gratuitas de GPU tipo Kaggle/Colab o GPU propia) | Media-alta, lento | Experimentos y uso interno |
| **B. Planes gratuitos de proveedores** de avatar | 0 € | Alta, con marca de agua y pocos minutos al mes | Validar el look del avatar |
| **C. Proveedor de pago o GPU en la nube** | Por segundo de vídeo | Alta, rápido | Producción para clientes (coste repercutido o BYOK) |

**Recomendación: el formato "avatar-lite".** El avatar aparece solo en el **gancho (3–5 s)** y en el **CTA final (2–3 s)**. El resto del vídeo es motion, slideshow o meme-mix con tu voz clonada. Así:

- reduces el tiempo de generación de avatar en un ~80 %,
- mantienes la conexión humana donde más importa (los primeros segundos),
- y es viable en GPU gratuita durante el MVP.

**Pasos para crear tu avatar:**

1. Graba una sola vez 2–3 minutos de vídeo base: buena luz, fondo neutro, mirando a cámara.
2. Graba un audio limpio de ~1 minuto para clonar la voz. Chatterbox (MIT, admite castellano y añade marca de agua inaudible) clona con pocos segundos, pero una muestra más larga da mejor calidad.
3. Registra tu consentimiento en el workspace.
4. Activa la etiqueta "contenido generado con IA" en cada plataforma.

> **Atención con las licencias:** al venderlo a terceros, solo sirven modelos con licencia comercial (MIT, Apache 2.0 o equivalentes). Quedan descartados los modelos con licencia "no comercial" (NC) o sin fichero de licencia. El Skill Curator debe comprobar esto en cada alta.

## 9.6 D5 · El stack de 0 €

| Pieza | Opción gratuita | Límite / cuándo empieza a costar |
|-------|-----------------|----------------------------------|
| **Agentes (LLM)** | **Fase interna:** ejecutar los agentes **dentro de Claude Code con tu suscripción actual**. Las definiciones de `agents/` se convierten en subagentes y skills de Claude Code | Sirve solo para tu propio uso. Para servir a clientes hace falta el Agent SDK con clave de API, con coste repercutido al cliente o BYOK |
| Render de vídeo | **Remotion**: gratis para equipos de hasta 3 personas, incluso para un SaaS | Con 4 o más personas: licencia "Automators" (~0,01 $/render, mínimo 100 $/mes). Alternativa MIT: Revideo / Motion Canvas. El renderer va detrás de una interfaz para poder cambiarlo |
| Voz (TTS + clon) | Chatterbox (MIT, local) | CPU/GPU propia |
| Avatar | Opción A o B de 9.5 | GPU (ver 9.5) |
| Transcripción | faster-whisper (local) | — |
| Edición / utilidades | FFmpeg | — |
| Tendencias | YouTube Data API (cuota gratuita), crédito mensual gratuito de Apify, TikTok Creative Center, listas de referentes | Más volumen de scraping → plan de pago |
| Base de datos y autenticación | Supabase (plan gratuito) | Límites de tamaño y de proyectos |
| Almacenamiento de vídeo | Cloudflare R2 (capa gratuita de ~10 GB) o disco local | Más volumen |
| Hosting de la web | Local o Cloudflare Pages | Ojo: el plan Hobby de Vercel no permite uso comercial |
| Colas de trabajo | BullMQ + Redis en local | — |
| Observabilidad | Langfuse autoalojado | — |
| Publicación | **Manual asistida** (el sistema prepara vídeo, caption y hashtags y tú subes) | Automatizar exige auditorías (gratuitas, pero lentas) |

**Lo que no puede ser 0 € a largo plazo:**

- la API del LLM cuando des servicio a clientes,
- la GPU para avatar en producción,
- y, si el equipo crece, la licencia de Remotion.

**Regla de negocio propuesta:** el MVP interno cuesta 0 € y **el primer cliente de pago financia los costes variables.** El contador de uso de 9.2 permite fijar un precio por crédito o por vídeo con margen.

## 9.7 Implicaciones para el modelo de negocio (borrador)

- **Planes por volumen:** vídeos/mes y segundos de avatar/mes, más canales conectados.
- **BYOK** con descuento para clientes que traen sus propias claves.
- **Onboarding guiado:** marca, público, objetivo, consentimiento de avatar y conexión de canales. El dashboard de objetivo es el argumento de venta ("de X a Y seguidores").
- **Marca blanca (más adelante):** para agencias que gestionan varias marcas.

## 9.8 Roadmap ajustado a estas decisiones

| Fase | Cambio respecto al cap. 7 |
|------|---------------------------|
| F0 | + Grabar el material base del avatar y la voz. + Cuenta de desarrollador de TikTok |
| F1 | El pipeline de guiones **se ejecuta en Claude Code** (sin app web todavía, 0 €). Aprobación de guiones en Markdown o en una página sencilla |
| F2 | Render local con Remotion. Formatos iniciales: **avatar-lite**, kinetic typography y meme-mix. Solo 9:16 |
| F3 | Publicación manual asistida en los 4 canales. Lectura automática de métricas donde haya API gratuita (YouTube Analytics, Instagram Insights, TikTok Display API) |
| F4 | Carcasa SaaS: workspaces, RLS, contador de uso. **Solicitar las auditorías** de Meta, TikTok y LinkedIn y la verificación de Google |
| F5 | Primeros clientes piloto con su propio workspace. Paso del LLM al Agent SDK con clave de API (BYOK o repercutido) |
