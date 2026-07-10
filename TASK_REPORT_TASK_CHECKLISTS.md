# Task Report: Mission Task Checklists with Persistent Progress

**Status:** READY FOR ARCHITECT REVIEW

**Date:** 2026-07-09

---

## Summary of Changes

### 1. `packages/types/src/index.ts` — Type Definitions
- Added `TaskCompletionStatus` interface with `requiredTasks: boolean[]` and `bonusTasks: boolean[]`.
- Extended `User` interface with `missionTasksCompleted: Record<string, TaskCompletionStatus>`.

### 2. `apps/web/lib/sampleData.ts` — Initial Data
- Seeded `missionTasksCompleted` on the sample user for all four missions.
- Completed missions (1–3) have all required tasks marked `true`; mission-4 is all `false`.
- Bonus tasks seeded to match each mission's definition.

### 3. `apps/web/app/contexts/UserContext.tsx` — State, Dynamic Missions & Persistence
- Added `parseMissionRecord()` — validates and parses a single mission record from stored data (mirrors `MissionsContext.parseMission`).
- Added `loadAllMissions()` — merges sample data with localStorage-persisted teacher-created missions. Stored missions take priority on `missionId` collision.
- **Review fix:** Changed `normalizeMissionStatus()` and `normalizeMissionTasksCompleted()` to iterate over `loadAllMissions()` instead of static `missions` from sampleData. This ensures teacher-created missions from localStorage get proper default entries and array resizing.
- Added `parseTaskCompletionStatus()` — validates stored boolean arrays.
- Added `parseMissionTasksCompleted()` — parses the full `missionTasksCompleted` record.
- Added `normalizeMissionTasksCompleted()` — ensures every mission has an entry sized to match current task definitions; resizes arrays preserving existing `true`/`false` values.
- Updated `parseStoredUser()` to parse and include `missionTasksCompleted` from localStorage.
- Updated `normalizedInitial` to include normalized `missionTasksCompleted`.
- Implemented `toggleTaskCompletion(missionId, isBonus, index)` — toggles a specific task's boolean, with defensive array growth for dynamically-created missions.
- Updated `UserContextValue` interface and `value` useMemo to include `toggleTaskCompletion`.
- Persistence is automatic via the existing `useEffect` that serializes `user` to `gra_userState` in localStorage.

### 4. `apps/web/app/mission/[missionId]/page.tsx` — UI
- Imported `useUser` and destructured `user` + `toggleTaskCompletion`.
- Replaced static `<ol>/<ul>` task lists with interactive checkbox UI.
- **Required tasks:** checkboxes with green accent styling when completed (green border, green bg, line-through text).
- **Bonus tasks:** checkboxes with yellow accent styling when completed.
- Fallback `taskStatus` handles missions not yet in `missionTasksCompleted` (defaults to all `false`).
- Added "All required tasks completed! You can submit your code." banner when all required tasks are checked.
- Dark galaxy aesthetic preserved (purple/cyan/yellow accents on `#111827` backgrounds).

---

## Code Review Fixes

### Issue 1: Static mission list normalization
**Problem:** `normalizeMissionTasksCompleted` and `normalizeMissionStatus` only iterated over static `missions` from `sampleData.ts`, missing teacher-created missions persisted in localStorage via `MissionsContext`.

**Fix:** Added `loadAllMissions()` which reads `gra_missions` from localStorage, validates each record via `parseMissionRecord()`, and merges with sample data (stored missions take priority on `missionId` collision). Both normalizers now call `loadAllMissions()` instead of the static `missions` array.

### Issue 2: eslint dependency removal
**Problem:** `eslint` devDependency was removed from `apps/web/package.json` (unrelated churn from parallel tasks).

**Fix:** Restored `"eslint": "^9.0.0"` to `apps/web/package.json` devDependencies.

### Other Working Tree Changes (Not Reverted)
The following changes are from parallel sprint tasks and are **intentionally left in place**:
- `apps/web/app/contexts/MissionsContext.tsx` — added `updateMission`/`deleteMission` (needed for validation scenario of editing task counts)
- `apps/web/app/teacher/page.tsx` — added Edit/Delete buttons (needed for validation scenario)
- `apps/web/eslint.config.js` — ESM format change from parallel eslint setup task
- Root `package.json` — `packageManager` field and `typecheck` path from earlier tasks
- `pnpm-lock.yaml` — `libc` field removals from sharp packages (pnpm v10.20.0 format change, not task-related)

---

## Validation Results

| Gate | Result |
|------|--------|
| `pnpm install` | ✅ Exit 0, lockfile consistent |
| `pnpm install --frozen-lockfile` | ✅ Exit 0, lockfile up to date |
| `pnpm lint` | ✅ Exit 0 (only pre-existing `MODULE_TYPELESS_PACKAGE_JSON` warning) |
| `pnpm typecheck` | ✅ Exit 0 |
| `pnpm build` | ✅ Exit 0 (8/8 pages generated, 0 errors) |

---

## Commands Run

```bash
cd "/Volumes/X10Pro/galaxy robot academy/"
pnpm install              # exit 0
pnpm install --frozen-lockfile  # exit 0
pnpm lint                 # exit 0
pnpm typecheck            # exit 0
pnpm build                # exit 0
```

---

## Files Modified

| File | Action |
|------|--------|
| `packages/types/src/index.ts` | Modified — added `TaskCompletionStatus` interface, extended `User` |
| `apps/web/lib/sampleData.ts` | Modified — seeded `missionTasksCompleted` |
| `apps/web/app/contexts/UserContext.tsx` | Modified — added `parseMissionRecord`, `loadAllMissions`, normalizers, `toggleTaskCompletion`, updated interface/value |
| `apps/web/app/mission/[missionId]/page.tsx` | Modified — added checkbox UI, completion banner |
| `apps/web/package.json` | Modified — restored `eslint` devDependency |

## Files Deleted

None.

## Dependencies

No new dependencies added. `eslint` devDependency restored to original version.

---

## Out of Scope

- Teacher-side task management or evaluation (Edit/Delete buttons added for validation but not part of this task's scope)
- Automatic awarding of GE or badges based on task completion alone
- Editing mission tasks (creation/editing pages unchanged)

---

## Browser Validation Checklist

> ⚠️ **Pending manual verification** — automated browser testing not available in this session.

1. ⏳ Open mission detail page — required and bonus checkboxes render unchecked initially
2. ⏳ Toggle required and bonus checkboxes — state updates immediately with visual feedback
3. ⏳ Refresh page — checked state persists via localStorage
4. ⏳ Teacher edit task counts — arrays resize without losing preserved values
5. ⏳ Submit mission — teacher dashboard/review flow unaffected
