# 5. Integraciones con redes sociales

Hay que distinguir **dos usos muy diferentes**:

1. **Investigar** contenido ajeno (tendencias) → muy limitado por APIs oficiales.
2. **Publicar y medir** tu propio contenido → bien soportado por APIs oficiales (con requisitos).

> Las APIs de las plataformas cambian a menudo. Antes de desarrollar cada conector, verificar la documentación vigente y los permisos requeridos.

## 5.1 YouTube

| Uso | API | Notas |
|-----|-----|-------|
| Tendencias | **YouTube Data API v3** `search.list` (`publishedAfter`, `q`, `regionCode`, `relevanceLanguage`, `videoDuration=short`) + `videos.list` (estadísticas) + `channels.list` | La mejor fuente oficial. Cuota diaria limitada (las búsquedas consumen mucha cuota) → cachear resultados |
| Publicar | Data API `videos.insert` (Shorts = vertical y ≤ 3 min) | Requiere OAuth y, para publicar en público vía API, verificación/auditoría de la app |
| Medir | **YouTube Analytics API** | Retención, vistas, suscriptores ganados por vídeo |

## 5.2 Instagram

| Uso | API | Notas |
|-----|-----|-------|
| Tendencias | **Graph API – Business Discovery** (métricas públicas de cuentas Business/Creator concretas) · **Hashtag Search** (limitado en nº de hashtags por semana) | No hay búsqueda libre de Reels por tema → complementar con **proveedores de scraping** (p. ej. Apify) revisando sus términos y riesgos |
| Publicar | **Content Publishing API** (Reels) | Requiere cuenta Business/Creator, app de Meta revisada, límites de publicaciones por día |
| Medir | **Insights API** por media | Alcance, reproducciones, guardados, compartidos, tiempo medio de visualización (según disponibilidad) |
| Test | **Trial Reels** (desde la app) | Validar si se puede automatizar vía API en el momento de implementar; si no, flujo manual asistido |

## 5.3 LinkedIn

| Uso | API | Notas |
|-----|-----|-------|
| Tendencias | Sin API de búsqueda de contenido | Scraping vía proveedores (con su riesgo de ToS) + **lista curada de creadores top** del nicho que vigilas periódicamente |
| Publicar | **Posts API / Community Management API** (perfil personal y páginas) | Acceso a ciertos productos requiere aprobación de LinkedIn; empezar con publicación en perfil personal |
| Medir | Analítica de posts (páginas; perfil personal con permisos limitados) | Si la API no da lo necesario: importación manual/CSV en el MVP |

## 5.3b TikTok

| Uso | API | Notas |
|-----|-----|-------|
| Tendencias | Sin API comercial de búsqueda (la Research API es académica) | TikTok Creative Center (web) + scraping + lista de referentes |
| Publicar | **Content Posting API** | Sin auditoría: solo publicaciones privadas y máx. 5 usuarios/24 h. Auditoría obligatoria para el SaaS |
| Medir | **Display API** | Vistas, likes, comentarios y compartidos de tus vídeos |

## 5.4 Estrategia por fases para no bloquearse

| Fase | Tendencias | Publicación | Métricas |
|------|------------|-------------|----------|
| **MVP** | YouTube API + Apify (IG/TikTok/LinkedIn) + TikTok Creative Center + lista manual de referentes | **Manual asistida**: el sistema prepara vídeo + caption + hashtags y tú publicas | YouTube Analytics API + Instagram Insights + TikTok Display API; LinkedIn manual |
| **V1** | + caché y monitorización diaria de cuentas semilla | IG + YouTube (+ TikTok tras auditoría) automáticos con aprobación | Automático en las cuatro donde la API lo permita |
| **V2** | + señales de audio/plantillas en tendencia | Programación óptima por hora | Atribución de seguidores y modelo predictivo |

Alternativa a valorar para publicar: **agregadores de publicación** (servicios tipo Ayrshare, Buffer API, etc.) que ya tienen las aprobaciones de las plataformas y simplifican mucho el MVP, a cambio de una cuota mensual.

## 5.5 Seguridad y cumplimiento

- Tokens OAuth cifrados, rotación de tokens, permisos mínimos.
- Respetar límites de llamadas (rate limits) y términos de uso; registrar el origen de cada dato.
- Datos de terceros (vídeos de referencia): uso **solo analítico**, no republicar su contenido.
- Etiquetar contenido generado/alterado con IA cuando la plataforma lo requiera (especialmente avatar/clon de voz).
- RGPD: si guardas datos de perfiles/comentarios de usuarios, minimizar y anonimizar.
