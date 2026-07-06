# Repository Structure

The target repository structure separates product decisions, academy content, applications, reusable packages, assets, and implementation prompts.

```text
docs/
  product/
  academy/
  engineering/
  design/
apps/
  web/
  admin/
packages/
  ui/
  types/
  config/
  utils/
  game-engine/
academy/
  foundation/
  curriculum/
  missions/
  homework/
  badges/
  certificates/
assets/
prompts/
```

## `docs/`

Contains authoritative written guidance and decisions. Documentation is organized by ownership so product, academy, engineering, and design concerns remain distinct.

## `docs/product/`

Contains the product requirements document, roadmap, product story, personas, and approved product decisions.

## `docs/academy/`

Documents curriculum strategy, teaching methodology, mission design, progression, assessment, badges, and Galaxy Energy policy.

## `docs/engineering/`

Contains this engineering handbook: the constitution, workflow, architecture principles, standards, templates, review process, and sprint history.

## `docs/design/`

Contains the design system, visual language, brand guidance, component specifications, interaction patterns, and accessibility guidance.

## `apps/`

Contains independently deployable user-facing applications. Applications may compose shared packages but should not duplicate shared domain logic.

## `apps/web/`

The Next.js front-end for students and teachers, including learning journeys, missions, progress, rewards, and teacher workflows.

## `apps/admin/`

Reserved for a future administration dashboard for managing users, cohorts, courses, content, and platform operations.

## `packages/`

Contains reusable, versioned modules shared across applications. Package boundaries should represent stable responsibilities and expose intentional public interfaces.

## `packages/ui/`

Contains reusable UI primitives and composed components that implement the design system without application-specific business logic.

## `packages/types/`

Contains shared TypeScript types and interfaces for domain models, API contracts, and cross-package boundaries.

## `packages/config/`

Contains typed configuration constants and shared tooling configuration. Environment-specific secrets must not be committed here.

## `packages/utils/`

Contains focused helper functions and reusable hooks that do not belong to a more specific domain package.

## `packages/game-engine/`

Planned home for testable domain logic governing missions, Galaxy Energy, ranks, badges, progression, and reward rules.

## `academy/`

Contains the source content and structured data used to operate the educational program. Content should remain independent from application presentation.

## `academy/foundation/`

Defines the academy's teaching philosophy, audience, learning model, terminology, and program foundations.

## `academy/curriculum/`

Defines course sequences, learning objectives, session plans, prerequisites, and progression across the program.

## `academy/missions/`

Contains structured mission definitions, instructions, objectives, hints, rewards, and completion criteria.

## `academy/homework/`

Contains take-home assignments, optional extensions, submission expectations, and related reward definitions.

## `academy/badges/`

Contains badge definitions, criteria, metadata, and assets references used by the progression system.

## `academy/certificates/`

Contains certificate definitions, completion requirements, templates, and issuance metadata.

## `assets/`

Contains shared static media such as images, illustrations, icons, audio, and downloadable resources. Source and licensing information should accompany external assets.

## `prompts/`

Contains reviewed prompts and work orders for AI-assisted engineering, content, and design tasks. Prompts should use the approved templates and avoid embedding secrets.
