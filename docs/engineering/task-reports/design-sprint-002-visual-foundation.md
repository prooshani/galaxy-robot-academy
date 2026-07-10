# Design Sprint 002 — Global Visual Foundation and Application Shell

Status: **READY FOR ARCHITECT REVIEW**  
Date: 2026-07-10

## Outcome

Repaired the Tailwind v4 pipeline, introduced the canonical dark visual token layer, loaded approved typography through `next/font`, added a restrained CSS galaxy canvas, created typed shared primitives, and replaced the shared navigation/application shell. Existing route logic and workflows remain unchanged.

## Implementation

- Added `@tailwindcss/postcss` configuration and explicit `packages/ui/src` source scanning.
- Added semantic color, typography, radius, shadow, glow, motion, and focus tokens.
- Added Inter, Space Grotesk, and JetBrains Mono with local build output and no runtime font request.
- Added star, nebula, and grid background layers with reduced-motion handling.
- Added Button, IconButton, Panel, PageContainer, PageHeader, SectionHeader, Input, Textarea, Select, Checkbox, FormField, StatusChip, GalaxyEnergyChip, Divider, ProgressBar, and EmptyState.
- Added responsive navigation, role state, active routes, mobile disclosure, skip link, landmarks, and R0-B0 CSS placeholder.
- Updated shared Layout so every current route receives consistent responsive spacing and typography.
- Added development-origin configuration used by local responsive browser verification.

## Files

- `apps/web/postcss.config.mjs` — created
- `apps/web/next.config.ts` — updated
- `apps/web/app/globals.css` — rebuilt with tokens and global visual foundation
- `apps/web/app/layout.tsx` — fonts and skip navigation
- `apps/web/components/NavBar.tsx` — responsive application shell
- `packages/ui/src/Layout.tsx` — responsive shared page layout
- `packages/ui/src/Primitives.tsx` — created shared primitives
- `packages/ui/src/index.ts` — exported primitive API
- `artifacts/design-sprint-002/*.png` — browser verification evidence
- this report

No dependency, Firebase, authentication, curriculum, data-model, or business-logic changes.

## Validation

- `pnpm typecheck` — passed
- `pnpm lint` — passed; pre-existing module-type warning remains
- `pnpm test` — passed, 1 test
- `pnpm build` — passed; all eight routes generated and CSS/font assets emitted
- Browser: `/`, `/role`, `/student`, `/badges`, `/mission/mission-1`, `/teacher` — rendered
- Browser console — no errors
- Viewport 320px — no horizontal overflow
- Desktop 1440px — required screenshot routes captured

## Screenshots

- `artifacts/design-sprint-002/home.png`
- `artifacts/design-sprint-002/role.png`
- `artifacts/design-sprint-002/student.png`
- `artifacts/design-sprint-002/badges.png`
- `artifacts/design-sprint-002/mission-mission-1.png`
- `artifacts/design-sprint-002/teacher.png`
- `artifacts/design-sprint-002/student-320.png`

## Review notes

- Route-local utility classes remain intentionally in place; this sprint establishes baseline consistency, not final page-specific redesigns.
- Native teacher prompt/confirm interactions remain unchanged because replacing them would expand behavior scope.

**Status: READY FOR ARCHITECT REVIEW**
