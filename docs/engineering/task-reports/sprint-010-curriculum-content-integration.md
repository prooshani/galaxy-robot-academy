# Sprint 010 — Curriculum Content Integration

Status: READY FOR ARCHITECT REVIEW

## Outcome

Canonical missions, badges, homework placeholders, and the course manifest live
under `academy/` and are exposed to the web application through the typed,
React-free `apps/web/lib/academyContent.ts` adapter.

The corrective pass aligned all twelve stable mission IDs with the approved
foundation progression, limited homework to 20 minutes, removed unapproved
advanced pedagogy, strengthened structural validation, and preserved teacher
mission edits and deletions during localStorage migration.

## Persistence and compatibility

- Stable IDs remain `mission-1` through `mission-12`.
- Exact untouched records from the original four fixtures migrate to canonical
  content.
- Teacher-edited records take precedence over canonical records.
- `gra_deletedMissionIds` stores deletion tombstones so deleted canonical
  missions are not silently recreated.
- Malformed mission or tombstone storage falls back safely.

## Architecture decisions

- `academy/` is the only canonical curriculum catalog.
- Application components consume content through `academyContent.ts`.
- Shared contracts remain in `@galaxy/types`; no competing domain types or new
  dependencies were added.
- Adapter status parsing replaces unchecked double assertions.
- The course manifest version is the sole content-version source.

## Files in the Sprint 010 correction

- `academy/README.md`
- `academy/missions/02-memory-module.ts`
- `academy/missions/03-communication-systems.ts`
- `academy/missions/04-decision-core.ts`
- `academy/missions/05-repeat-protocol.ts`
- `academy/missions/06-navigation-scanner.ts`
- `academy/missions/08-reusable-skill-modules.ts`
- `academy/missions/09-planetary-exploration.ts`
- `academy/missions/10-random-space-events.ts`
- `academy/missions/11-launch-preparation.ts`
- `academy/missions/12-mission-to-andromeda.ts`
- `academy/homework/index.ts`
- `apps/web/app/contexts/MissionsContext.tsx`
- `apps/web/app/contexts/UserContext.tsx`
- `apps/web/lib/academyContent.ts`
- `package.json`
- `scripts/validate-curriculum.mjs`
- `scripts/curriculum.test.mjs`
- this report

No files were deleted. No dependency was added.

## Validation

- `pnpm validate-curriculum`: passed
- `pnpm test`: passed, 1 test
- `pnpm lint`: passed; Node emitted the pre-existing module-type warning for
  `apps/web/eslint.config.js`
- `pnpm typecheck`: passed
- `pnpm build`: passed; all eight routes generated
- `git diff --check`: passed

## Known limitations

The repository contained unrelated uncommitted work before this correction.
That work was preserved and no commit was created, because a focused Sprint 010
commit cannot be safely produced without deciding ownership of those existing
changes.
