# 6. Modelo de datos y dashboard de seguimiento

## 6.1 Entidades principales

```
Workspace (cliente/tenant) ── Brand ─┬─ BrandKit (colores, fuentes, logo, tono, plantillas)
       └─ Campaign ─┬─ Goal (métrica, valor inicial, objetivo, fecha)
                    ├─ ChannelAccount (TikTok, IG, YT, LinkedIn + tokens)
                    └─ Idea ─┬─ TrendBrief ── ReferenceVideo[]
                             ├─ FormatPlaybook
                             └─ Version[] ─┬─ Script
                                           ├─ BrandReview
                                           ├─ Render[] (por formato/aspect ratio)
                                           ├─ QAReport
                                           ├─ ViralityForecast
                                           └─ Publication[] ── MetricSnapshot[]
Skill ── SkillUsage[] (qué Render la usó) ── SkillReview[]
AgentRun (traza de cada ejecución: agente, input, output, coste, duración, estado)
Learning (insights agregados: "en LinkedIn, ángulo 'error común' + 45 s rinde ×1.8")
```

Tablas clave (Postgres):

| Tabla | Campos clave |
|-------|--------------|
| `workspaces` | id, name, plan, byok_keys (cifradas), usage_counters, avatar_consent |
| `campaigns` | id, workspace_id, brand_id, name, industry, target_audience (jsonb), channels[], budget_eur, start_at, end_at |
| `goals` | id, campaign_id, metric (`followers`, `views`, `engagement_rate`, `leads`), channel, baseline, target, deadline |
| `ideas` | id, campaign_id, prompt, topic, status |
| `reference_videos` | id, idea_id, platform, url, author, published_at, views, likes, comments, shares, saves, duration_s, outlier_score, relevance |
| `versions` | id, idea_id, angle, visual_format, hook_type, duration_s, platform, cta, status |
| `renders` | id, version_id, aspect_ratio, storage_url, skills_used[], cost_eur |
| `publications` | id, version_id, platform, external_id, published_at, is_trial |
| `metric_snapshots` | id, publication_id, taken_at, views, reach, avg_watch_s, completion_rate, likes, comments, shares, saves, follows |
| `skills` | id, name, category, type, status, cost_model, added_at |
| `agent_runs` | id, agent, idea_id, version_id, input, output, tokens, cost_eur, duration_ms, status |

## 6.2 Onboarding (se define al inicio)

1. Marca: nombre, logo, colores, tipografías, tono, ejemplos de contenido que te gustan / no te gustan.
2. Público objetivo: rol, industria, país, idioma, dolores, deseos, objeciones.
3. Canales a conectar (OAuth) y valores actuales (seguidores, vistas medias) → **baseline** automático.
4. **Objetivo (North Star):** p. ej. "de 1.200 a 10.000 seguidores en LinkedIn en 120 días" + métricas secundarias.
5. Ritmo de producción: ideas/semana, versiones/idea, presupuesto mensual.
6. Nivel de autonomía: qué pasos requieren tu aprobación.

## 6.3 Dashboard

**Vista 1 — Objetivo (la principal)**
- Barra de progreso baseline → actual → objetivo, por canal.
- Curva real vs. **ritmo necesario** (línea recta o curva esperada hasta la fecha objetivo) → semáforo: adelantado / en línea / retrasado.
- Proyección de fecha de llegada al ritmo actual.

**Vista 2 — Pipeline de producción**
- Kanban por idea: Investigando → Analizando → Guiones → Marca → Editando → QA → Listo → Publicado.
- Estado de cada agente en tiempo real, coste acumulado por idea.

**Vista 3 — Rendimiento de contenido**
- Tabla de versiones: plataforma, ejes (ángulo/formato/gancho/duración), score previsto vs. real, vistas, retención, engagement, seguidores ganados.
- **Heatmap de ejes:** qué combinación ángulo × formato funciona mejor por plataforma.
- Top/bottom 5 de la semana con el "por qué" del Analista.

**Vista 4 — Aprendizajes y skills**
- Insights acumulados (memoria del sistema).
- Estado del Skill Registry: activas, en prueba, en revisión, retiradas; uso y rendimiento por skill; alertas de fatiga.

**Vista 5 — Costes**
- Coste por versión, por formato, por proveedor; coste por 1.000 vistas y por nuevo seguidor.

## 6.4 KPIs clave

| KPI | Definición |
|-----|------------|
| Hook rate | % de espectadores que pasan de 3 s |
| Retención media | segundos vistos / duración |
| Completion rate | % que ve el vídeo completo |
| Engagement rate | (likes + comentarios + compartidos + guardados) / alcance |
| Share & save rate | (compartidos + guardados) / alcance → mejor predictor de alcance orgánico |
| Seguidores por 1.000 vistas | eficiencia en crecer audiencia |
| Coste por seguidor | coste total / seguidores ganados |
| Precisión del Oracle | correlación score previsto vs. vistas reales a 7 días |
