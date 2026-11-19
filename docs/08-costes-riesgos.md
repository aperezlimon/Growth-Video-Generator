# 8. Costes estimados y riesgos

## 8.1 Orden de magnitud de costes (por versión de vídeo)

> Estimaciones orientativas a validar en la fase 2; los precios de proveedores cambian a menudo.

| Concepto | Formato barato (motion/meme) | Formato caro (avatar/generativo) |
|----------|------------------------------|----------------------------------|
| LLM (investigación + análisis amortizado + guion + QA) | bajo (céntimos – ~0,5 €) | igual |
| Voz (TTS) | céntimos | céntimos |
| Render (Remotion local/Lambda) | céntimos | céntimos |
| Avatar / vídeo generativo | — | varios € por vídeo según duración y proveedor |
| Stock / música con licencia | suscripción mensual | suscripción mensual |

**Costes fijos mensuales típicos:** scraping (Apify u otro), Supabase, almacenamiento, suscripciones de voz/avatar/stock, posible agregador de publicación.

**Regla de presupuesto:** el 70–80 % de las versiones en formatos baratos; los formatos caros se reservan para ideas que ya han demostrado tracción.

## 8.2 Riesgos y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Cambios/limitaciones de API (IG, LinkedIn) | Alta | Alto | Capa de integraciones desacoplada; plan B manual/agregador |
| Bloqueo de scraping | Media | Medio | Varios proveedores, caché, lista de referentes manual |
| Contenido genérico ("huele a IA") | Alta | Alto | Brand Guardian estricto, tu cara/voz, opiniones propias, QA exigente |
| Copyright (memes, música) | Media | Alto | Biblioteca con licencias, audio con licencia, evaluador de cumplimiento |
| Penalización por spam / repetición | Media | Alto | Publicación escalonada, Trial Reels, variedad real de ejes |
| Fatiga de formato | Alta | Medio | Skill Curator + detección de caídas de rendimiento |
| Costes descontrolados | Media | Medio | Presupuesto por campaña, alertas, routing barato |
| Predicción de viralidad poco fiable | Alta (al inicio) | Bajo-Medio | Presentarla como prioridad relativa, calibrar con datos |
| Licencias de modelos open source (avatar/TTS) incompatibles con uso comercial | Media | Alto | Solo MIT/Apache o equivalentes; verificación en cada alta de skill |
| Auditorías de apps (Meta, TikTok, LinkedIn) lentas o denegadas | Media | Alto | Solicitarlas pronto; publicación manual asistida mientras tanto |
| Uso de tu imagen/voz | Baja | Alto | Consentimiento, almacenamiento seguro, etiquetado IA |

## 8.3 Decisiones (resueltas en el cap. 9)

Respuestas: 1) SaaS para terceros con uso interno; 2) canales verticales (TikTok, Reels, Shorts, LinkedIn vertical); 3) aprobación de guiones y publicación; 4) avatar; 5) 0 € en el MVP. Preguntas originales:

1. ¿Uso **personal** (tu marca) o **producto multi-cliente** desde el principio? → afecta a multi-tenant, auth y facturación.
2. ¿Qué **canal es prioritario** para el North Star? (Recomendación: uno principal + dos secundarios).
3. ¿Nivel de autonomía inicial? (Recomendación: aprobar guiones y publicación en el MVP).
4. ¿Grabarás tú el talking head o irás directo a avatar? (Recomendación: grabar en bruto al principio; mayor autenticidad y coste casi nulo).
5. ¿Presupuesto mensual de herramientas para el MVP?
