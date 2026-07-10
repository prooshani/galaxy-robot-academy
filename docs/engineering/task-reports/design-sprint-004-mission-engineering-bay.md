# Task Report — Design Sprint 004: Mission Engineering Bay

=== TASK REPORT ===
Task: Design Sprint 004 — Mission Engineering Bay and R0-B0 Mission Experience
Status: READY FOR ARCHITECT REVIEW
Created Files:
* apps/web/lib/missionExperience.ts
* scripts/mission-experience.test.mjs
* packages/ui/src/StudentProgress.tsx
* docs/engineering/task-reports/design-sprint-004-mission-engineering-bay.md
Modified Files:
* apps/web/app/mission/[missionId]/page.tsx
* apps/web/app/mission/[missionId]/MissionSubmissionForm.tsx
* apps/web/app/not-found.tsx
* packages/ui/src/index.ts
Deleted Files:
* (none)
Dependencies Added:
None
Commands Executed:
* pnpm lint
* pnpm typecheck
* pnpm test
* pnpm build
* pnpm test (Sprint 004 review tests)
* Browser checks: `/mission/mission-1` desktop and 390px mobile; `/mission/unknown-mission`
Validation result:
* Lint passed (existing Node module-type warning only).
* Typecheck passed.
* Tests passed: 3/3 — curriculum validation plus Sprint 004 mission navigation and submission behavior tests.
* Production build passed.
* Browser checks passed: visible content, no framework error overlay, mission controls render, mobile has no horizontal overflow, code textarea width is usable at 390px, invalid mission provides journey return link.
Implementation summary:
* Redesigned mission detail as Engineering Bay with mission header, briefing, task and bonus checklists, progress rail, contextual R0-B0 status, reward data, feedback and completion states.
* Preserved existing task persistence, submission creation, review data, GE/badge logic, and teacher review behavior.
* Submission panel preserves prior behavior: code is required, but required checklist completion never blocks sending. It communicates submission/revision/review states and makes clear code is not executed.
* Reworked global not-found state into a mission-journey recovery screen.
Important notes:
* Existing working-tree changes outside this task were preserved.
* Review status is derived from existing submission data; no new status source or automatic GE award was introduced.
* The current teacher flow does not create `needs_revision` records, but the mission experience now renders that existing submission state if present.
* Completion navigation uses canonically ordered available missions. Final mission returns to mission journey.
Git:
* Commit hash: not committed
* Branch: main
