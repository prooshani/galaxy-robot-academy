# Design Sprint 003 — Student Cockpit and Badge Hall

Status: **READY FOR ARCHITECT REVIEW**  
Date: 2026-07-10

## Outcome

Redesigned `/student` as Explorer Cockpit and `/badges` as Hall of Achievements. Existing user, mission, submission, badge, rank, navigation, localStorage, and mission-link behavior remains intact.

## Implementation

- Added dominant next-mission briefing with status, GE, duration, robot upgrade, R0-B0 reaction, and mission CTA.
- Added reusable rank progress, Galaxy Energy meter, mission status, badge card, and metric components in `packages/ui`.
- Added ordered mission journey with readable status labels, rewards, duration, upgrades, and 44px actions.
- Added R0-B0 status, Academy summary, recent submission activity, and recent achievements.
- Added maximum-rank, all-complete, no-missions, no-activity, no-badges, and unavailable-catalog presentation.
- Split Badge Hall into unlocked and locked regions with completion summary and mission association where available.
- Added reduced-motion-safe transitions and semantic progressbar alternatives.

## Files

- `apps/web/app/student/page.tsx`
- `apps/web/app/badges/page.tsx`
- `packages/ui/src/StudentProgress.tsx` — created
- `packages/ui/src/index.ts`
- `artifacts/design-sprint-003/*.png`
- this report

No dependency, mission logic, submission logic, localStorage, curriculum, teacher-dashboard, or mission-detail changes.

## Validation

- `pnpm typecheck` — passed
- `pnpm lint` — passed
- `pnpm test` — passed, 1 test
- `pnpm build` — passed; all eight routes generated
- Browser: `/student`, `/badges` — rendered with student role
- Viewports: 320, 375, 768, 1024, 1440px — no horizontal overflow
- Framework error overlay — absent at every checked viewport
- Progress elements and target route headings — present
- Desktop and mobile screenshots — captured

## Screenshots

- `artifacts/design-sprint-003/student-desktop.png`
- `artifacts/design-sprint-003/student-mobile.png`
- `artifacts/design-sprint-003/badges-desktop.png`
- `artifacts/design-sprint-003/badges-mobile.png`

## Review notes

- Current domain model exposes four mission states. UI component supports additional requested labels without changing state logic.
- Locked badge content remains readable because canonical badge data does not expose secret/hidden metadata.
- R0-B0 uses an original CSS module placeholder; no image assets added.

**Status: READY FOR ARCHITECT REVIEW**
