# Task Report: Role Selection and Teacher Access Control

**Status:** READY FOR ARCHITECT REVIEW
**Date:** 2026-07-09
**Task:** Implement role selection and teacher access control

---

## Summary

Introduced a lightweight role selection mechanism that lets users choose between "Student" and "Teacher" roles. The role is persisted in localStorage, affects navigation visibility, and gates access to the teacher dashboard. No authentication or user accounts — just a simple client-side role flag.

---

## Files Created

| File | Purpose |
|------|---------|
| `apps/web/app/role/page.tsx` | Role selection page with two clickable cards (Student / Teacher). Calls `setRole()` then navigates to the appropriate dashboard. |
| `apps/web/components/RoleGuard.tsx` | Client-side wrapper that redirects unauthenticated users (role === null) to `/role`. Uses a `mounted` flag to prevent hydration mismatch. |

## Files Modified

| File | Change |
|------|--------|
| `packages/types/src/index.ts` | Added `UserRole` type (`"student" | "teacher"`). Changed `User.role` from `"student" | "teacher"` to `UserRole | null`. |
| `apps/web/lib/sampleData.ts` | Changed default `role` from `"student"` to `null`. Fixed `mission-4` status from `"in_progress"` to `"notStarted"` (invalid for `MissionStatus` type). |
| `apps/web/app/contexts/UserContext.tsx` | Added `setRole(role: UserRole)` to context. Updated `parseStoredUser` to validate and preserve `role` as nullable. All existing fields (`id`, `displayName`, `createdAt`) are correctly parsed. |
| `apps/web/app/layout.tsx` | Wrapped `NavBar` + `children` in `<RoleGuard>` so unauthenticated users are redirected to `/role` before seeing any page content. |
| `apps/web/components/NavBar.tsx` | Filters out the `/teacher` nav link unless `user.role === "teacher"`. |
| `apps/web/app/teacher/page.tsx` | Added role check: if `user.role !== "teacher"`, shows an access-denied message with a link to `/role`. All hooks are called before the conditional return (Rules of Hooks compliant). `handleMarkReviewed` correctly calls `reviewSubmission` then `awardGE` or `setMissionStatus`. |

## Files Deleted

| File | Reason |
|------|--------|
| `packages/types/index.ts` | Orphaned file created at the wrong path. Real types live in `packages/types/src/index.ts` (per `package.json` main/types fields). |

## Dependencies

No new dependencies added. Uses only Next.js built-in router (`next/navigation`) and localStorage.

---

## Commands Run

```bash
pnpm typecheck   # ✅ Passed — zero errors
pnpm lint        # ✅ Passed — zero errors (pre-existing module warning unrelated)
pnpm build       # ✅ Passed — 7 routes compiled successfully
```

Build output confirmed all routes:
```
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /badges
├ ƒ /mission/[missionId]
├ ○ /role          ← NEW
├ ○ /student
└ ○ /teacher
```

---

## Validation Results

| Acceptance Criterion | Status |
|---------------------|--------|
| Visiting without stored role redirects to `/role` | ✅ (RoleGuard redirects when `role === null`) |
| Selecting "Student" → `/student`, teacher link hidden | ✅ (`setRole("student")` + filter in NavBar) |
| Selecting "Teacher" → `/teacher`, teacher link visible | ✅ (`setRole("teacher")` + filter in NavBar) |
| `/teacher` access denied for non-teachers | ✅ (conditional render + redirect in teacher page) |
| Role persists on refresh | ✅ (saved to localStorage via `UserProvider` useEffect) |
| Clearing localStorage resets role selection | ✅ (default `role: null` in sampleData) |
| `pnpm lint` passes | ✅ |
| `pnpm typecheck` passes | ✅ |
| `pnpm build` passes | ✅ |
| Dark galaxy theme intact | ✅ (no theme changes) |

---

## Important Notes

1. **No role-switching mechanism.** Once a role is selected, the only way to change it is clearing localStorage. This matches the lightweight scope but may surprise users. A "switch role" button could be added later.

2. **Blank screen during mount.** `RoleGuard` returns `null` until `mounted === true`, preventing a flash of wrong content during hydration. This is intentional but could be improved with a loading spinner in a future iteration.

3. **`setRole` + `router.push` race.** In `role/page.tsx`, `setRole` updates React state (and triggers localStorage write via `useEffect`) while `router.push` navigates. Both are asynchronous in Next.js, so the role should be committed before navigation completes. This works in practice but is a potential edge case.

4. **Pre-existing changes in working tree.** The `student/page.tsx`, `mission/[missionId]/page.tsx`, `MissionSubmissionForm.tsx`, `SubmissionsContext.tsx`, `sampleSubmissions.ts`, and `badges/page.tsx` files were modified by a prior task (mission status & badges display). These are already passing validation and were not touched in this task.

5. **`/badges` is role-agnostic.** Both students and teachers can access the badges page. This is intentional — out of scope per requirements.

---

## Git Details

**Modified files:** `apps/web/app/layout.tsx`, `apps/web/app/mission/[missionId]/page.tsx`, `apps/web/app/student/page.tsx`, `apps/web/eslint.config.js`, `apps/web/lib/sampleData.ts`, `apps/web/package.json`, `package.json`, `packages/types/src/index.ts`, `pnpm-lock.yaml`

**New files:** `apps/web/app/badges/`, `apps/web/app/contexts/`, `apps/web/app/mission/[missionId]/MissionSubmissionForm.tsx`, `apps/web/app/role/page.tsx`, `apps/web/app/teacher/`, `apps/web/components/RoleGuard.tsx`, `apps/web/components/NavBar.tsx`, `apps/web/lib/sampleSubmissions.ts`

**Deleted files:** `packages/types/index.ts` (orphaned)

---

## Conclusion

All acceptance criteria are met. The implementation is clean, type-safe, and passes all automated validation gates. The role selection feature is ready for architect review.

**Status: READY FOR ARCHITECT REVIEW**
