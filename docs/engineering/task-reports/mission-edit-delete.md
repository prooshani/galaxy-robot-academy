# Task Report: Mission Editing and Deletion

**Status:** READY FOR ARCHITECT REVIEW
**Date:** 2026-07-09
**Implementer:** Implementation Engineer

---

## Summary

Added mission editing and deletion capabilities to the teacher dashboard. Teachers can now navigate to a pre-filled edit form for any mission, modify fields, and save changes. They can also delete missions with a confirmation prompt. Both operations persist to `localStorage` and propagate immediately to teacher and student dashboards.

---

## Files Created

| File | Action |
|---|---|
| `apps/web/app/teacher/missions/[missionId]/edit/page.tsx` | Created — new edit page |

## Files Modified

| File | Change |
|---|---|
| `apps/web/app/contexts/MissionsContext.tsx` | Added `updateMission` and `deleteMission` to context type, implementations, and memoized value |
| `apps/web/app/teacher/page.tsx` | Added "Actions" column header; added Edit link and Delete button to each mission row |

## Files Deleted

*None.*

## Dependencies

No new dependencies introduced.

## Types

No type changes needed — `bonusTasks: string[]` already existed in `packages/types/src/index.ts`.

---

## Implementation Notes

### 1. MissionsContext (`updateMission`, `deleteMission`)

- **`updateMission(missionId: string, updates: Partial<Omit<Mission, "missionId">>)`** — uses `Array.map` to produce a new array with the matched mission spread with the partial updates. The `missionId` is preserved (never overwritten) because `Omit<Mission, "missionId">` excludes it from the updates type.
- **`deleteMission(missionId: string)`** — uses `Array.filter` to produce a new array excluding the matched mission.
- Both functions trigger the existing `useEffect` in `MissionsProvider` which syncs `missions` to `localStorage` under the key `gra_missions`. No additional persistence code required.
- Both functions are included in the `useMemo` value alongside `missions` and `addMission`.

### 2. Teacher Dashboard (`teacher/page.tsx`)

- Imported `deleteMission` from `useMissionsContext()`.
- Added an "Actions" `<th>` column to the mission table header.
- Each mission row now renders:
  - A `<Link>` to `/teacher/missions/${mission.missionId}/edit` styled as a cyan action button.
  - A `<button>` that calls `window.confirm()` before invoking `deleteMission(mission.missionId)`. Styled as a red action button.
- Deletion updates the `missions` state immediately, causing the table to re-render without the deleted row.

### 3. Edit Page (`teacher/missions/[missionId]/edit/page.tsx`)

- **Hooks-first ordering:** All `useState` declarations are placed unconditionally before any early returns (role guard, notFound). This satisfies React's Rules of Hooks.
- **Form pre-filling:** Array fields (`objectives`, `requiredTasks`, `bonusTasks`) are converted to comma-separated strings via `.join(", ")` for display in `<textarea>` inputs. On submit, they are split back to arrays via `.split(",").map(s => s.trim()).filter(Boolean)`, mirroring the creation page's serialization logic.
- **Badge selection:** `selectedBadges` is initialized from `mission.badgeIds`. The `toggleBadge` helper manages checkbox state identically to the creation page.
- **Validation:** Identical to `new/page.tsx` — title, session number, story, objectives, required tasks, and reward GE are all validated. Bonus tasks are optional.
- **Submit:** Calls `updateMission(mission.missionId, { ... })` with the parsed form values, then navigates to `/teacher`.
- **Error handling:** Invalid or missing `missionId` triggers `notFound()` (Next.js App Router). Non-teacher users see an access-denied message.

---

## Commands Run

```
pnpm typecheck  →  exit 0  (no errors)
pnpm lint       →  exit 0  (no errors)
pnpm build      →  exit 0  (compiled successfully, route registered)
```

Build output confirmed the new route:
```
ƒ  /teacher/missions/[missionId]/edit   (server-rendered on demand)
```

---

## Validation Results

| Criterion | Status |
|---|---|
| `updateMission(missionId, updates)` typed and implemented | ✅ |
| `deleteMission(missionId)` typed and implemented | ✅ |
| Both functions update state immutably | ✅ |
| Both persist via existing `gra_missions` localStorage effect | ✅ |
| Both included in context type and memoized value | ✅ |
| Teacher dashboard shows Edit link per mission | ✅ |
| Teacher dashboard shows Delete button with `window.confirm` | ✅ |
| Edit page loads mission by route `missionId` | ✅ |
| Edit page pre-fills all form fields | ✅ |
| Edit page calls `updateMission` on submit | ✅ |
| Edit page navigates back to `/teacher` | ✅ |
| Invalid mission IDs handled via `notFound()` | ✅ |
| No new types added | ✅ |
| No new dependencies added | ✅ |
| `pnpm typecheck` passes | ✅ |
| `pnpm lint` passes | ✅ |
| `pnpm build` passes | ✅ |
| Dark galaxy aesthetic preserved | ✅ |
| Strict TypeScript (no `any`) | ✅ |
| Rules of Hooks satisfied (hooks before early returns) | ✅ |

---

## Known Considerations

1. **Stale form on concurrent tab deletion:** If a mission is deleted in another browser tab while the edit form is open, `updateMission` will silently no-op (the `map` won't find a matching `missionId`). This is acceptable for localStorage-based state.
2. **`notFound()` after role guard:** A non-teacher visiting an invalid edit URL sees the access-denied message rather than a 404. This is correct authorization-before-resource-existence behavior.
3. **Function stability:** `updateMission` and `deleteMission` are recreated every render. This matches the existing pattern (same as `addMission`) and is functionally correct since `setMissions` is stable. `useCallback` was not added to avoid unnecessary complexity.

---

## Definition of Done

- [x] Implementation complete per work order
- [x] All acceptance criteria met
- [x] `typecheck`, `lint`, `build` pass
- [x] No new dependencies
- [x] Strict TypeScript maintained
- [x] Dark galaxy aesthetic preserved
- [x] Task Report written

**Status: READY FOR ARCHITECT REVIEW**
