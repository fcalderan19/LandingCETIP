# Specs — LandingCETIP

Specs en formato spec-driven-development. Dos features:

- **`001-current-sanity/`** — Spec retroactiva del estado actual (Next.js 15 + Sanity CMS).
  Documenta lo que existe hoy para tener una baseline antes de cambiarlo.
- **`002-admin-builder/`** — Reemplazar Sanity por un módulo admin propio con drag-and-drop,
  Postgres (Neon) + Prisma, y publicación vía `revalidateTag` (ISR).

Lee primero `001` para entender el punto de partida, luego `002` para el plan de migración.

Cada feature contiene:

| Archivo | Propósito |
|---|---|
| `spec.md` | Qué construimos y por qué (objetivo, criterios de éxito, scope). |
| `plan.md` | Orden de implementación, riesgos, checkpoints. |
| `research.md` | Decisiones técnicas con alternativas evaluadas. |
| `data-model.md` | Entidades, relaciones, schemas (cuando aplica). |
| `ui-frontend.md` | Estructura de UI, rutas, componentes, estados. |
| `tasks.md` | Checklist de tareas implementables con criterios de aceptación. |
| `contracts.md` | Contratos de API / Server Actions (solo 002). |
