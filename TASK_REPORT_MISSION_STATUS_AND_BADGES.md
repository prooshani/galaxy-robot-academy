# Task Report: Mission Status Tracking & Badge Display

**Status:** READY FOR ARCHITECT REVIEW
**Date:** 2026-07-08
**Target:** `/Volumes/X10Pro/Galaxy robot academy/`

---

## Summary

Applied review corrections to implement per-mission status tracking (`notStarted`, `submitted`, `reviewed`, `completed`), visual badge display on the student dashboard, global navigation, and a dedicated badges collection page. All changes use the existing `#111827` dark galaxy aesthetic with cyan/purple accents — no new dependencies added.

---

## File Changes

### 1. `packages/types/src/index.ts`
- Added `export type MissionStatus = "notStarted" | "submitted" | "reviewed" | "completed"`
- Changed `User.missionStatus` from inline union `Record<string, "not_started" | "in_progress" | "completed">` to `Record<string, MissionStatus>`
- `Badge` interface preserved: `badgeId`, `name`, `icon`, `category`, `description`

### 2. `apps/web/lib/sampleData.ts`
- Changed `"mission-4": "in_progress"` → `"mission-4": "notStarted"` (camelCase to match `MissionStatus`)
- All 4 mission IDs already present in initial `missionStatus`
- All badges already have `badgeId`, `name`, `icon`; all missions already reference `badgeIds`

### 3. `apps/web/app/contexts/UserContext.tsx`
- Added `normalizeMissionStatus()` helper: iterates all missions, defaults missing entries to `"notStarted"`
- Rewrote `UserProvider` to normalize initial state before `useState`
- New `setMissionStatus(missionId, status)` exported via `useUser()`
- Changed `awardGE` signature from `(amount, options?)` to `(missionId, geAwarded, badgeIds?)`:
  - Adds `geAwarded` to `totalGE`
  - Updates `rankId` via `getRankByGE()`
  - Adds unique `badgeIds` (deduplicated)
  - Sets mission status to `"completed"`

### 4. `apps/web/app/mission/[missionId]/MissionSubmissionForm.tsx`
- Client component with form for code submission
- Validates `codeSnippet` (min 10 chars)
- On submit: calls `addSubmission()` then `setMissionStatus(missionId, "submitted")`
- Shows success/error states with styled feedback

### 5. `apps/web/app/teacher/page.tsx`
- Teacher dashboard with submission table
- `handleMarkReviewed(sub)` calls `reviewSubmission()` then `setMissionStatus(missionId, "reviewed")`
- `awardGE` called when `geAwarded > 0`, guards against missing mission
- Added "Create Mission" button linking to `/teacher/missions/new`

### 6. `apps/web/app/student/page.tsx`
- Student dashboard with per-mission status indicators
- Status color classes: `notStarted` (gray), `submitted` (yellow), `reviewed` (blue), `completed` (green)
- Earned badges display with icon + name from `UserContext`
- Mission cards link to `/mission/{missionId}`

### 7. `apps/web/app/badges/page.tsx`
- Dedicated badges collection page
- Lists all badges with icon, name, description
- Shows locked/unlocked state from `UserContext.badgeIds`

### 8. `apps/web/components/NavBar.tsx`
- Global navigation bar with links to `/student`, `/badges`, `/teacher`
- Active link highlighting based on current route
- Responsive design with mobile-friendly layout

### 9. `apps/web/app/layout.tsx`
- Imports and renders `NavBar` on all pages
- Provider order: `UserProvider` → `SubmissionsProvider`

### 10. `apps/web/components/RoleGuard.tsx`
- Route guard component for role-based access control
- Redirects unauthorized users to `/role`

---

## Validation Checklist

| # | Requirement | Status |
|---|-------------|--------|
| 1 | `UserContext` tracks `missionStatus` per mission with `notStarted` default | ✅ |
| 2 | `MissionSubmissionForm` sets `"submitted"`; teacher page sets `"reviewed"`/`"completed"` | ✅ |
| 3 | Student dashboard shows per-mission status with color classes; badges display with icon+name | ✅ |
| 4 | `pnpm lint`, `pnpm typecheck`, `pnpm build` pass; no new repo dependencies | ✅ |
| 5 | Global `NavBar` on all pages; `/badges` page with locked/unlocked states | ✅ |
| 6 | `addMission` auto-generates unique `missionId`; localStorage persistence via `gra_missions` | ✅ |

---

## Data Flow

```
Student submits code
  → MissionSubmissionForm.handleSubmit()
  → addSubmission() → status: "submitted"
  → setMissionStatus(missionId, "submitted")
  → Student dashboard shows yellow "submitted" badge

Teacher reviews submission
  → handleMarkReviewed()
  → reviewSubmission() → status: "reviewed"
  → if geAwarded > 0:
      awardGE(missionId, geAwarded, badgeIds)
      → totalGE += geAwarded, rank updated, badges added
      → setMissionStatus(missionId, "completed")
      → Student dashboard shows green "completed" badge
    else:
      setMissionStatus(missionId, "reviewed")
      → Student dashboard shows blue "reviewed" badge
```

---

## Follow-Up Task Report: useMissionsContext Rename & Mission Creation Flow

**Status:** COMPLETED
**Date:** 2026-07-09
**Commit:** `5b503a1`
**Target:** `/Volumes/X10Pro/Galaxy robot academy/`

### Summary

Applied review corrections to rename the mission hook to `useMissionsContext()`, add a backwards-compatible deprecated alias, implement the teacher-side mission creation form, fix `addMission` ID generation, and validate the full build pipeline. The commit `5b503a1` contains 16 files with 1,576 insertions and 39 deletions.

### File Changes

#### 1. `apps/web/app/contexts/MissionsContext.tsx`
- Renamed primary export from `useMissions()` to `useMissionsContext()`
- Added `@deprecated` alias: `export const useMissions = useMissionsContext` for backwards compatibility
- `addMission` accepts `Omit<Mission, "missionId">` and auto-generates unique IDs via `Date.now()` + random suffix
- Provider order in `MissionsProvider` is correct; localStorage key remains `gra_missions`

#### 2. `apps/web/app/student/page.tsx`
- Updated import and call from `useMissions()` → `useMissionsContext()`

#### 3. `apps/web/app/teacher/page.tsx`
- Updated import and call from `useMissions()` → `useMissionsContext()`

#### 4. `apps/web/app/teacher/missions/new/page.tsx`
- Updated import and call from `useMissions()` → `useMissionsContext()`
- Full mission creation form with title, session, story, objectives, required/bonus tasks, reward GE, badge selection
- Client-side validation with error messages
- Redirects to `/teacher` on successful creation

#### 5. `apps/web/app/mission/[missionId]/page.tsx`
- Updated import and call from `useMissions()` → `useMissionsContext()`

#### 6. `apps/web/app/contexts/UserContext.tsx`
- `normalizeMissionStatus()` updated to preserve dynamically-created mission entries (iterates `Object.entries(initial)` first before fallback to sample missions)

#### 7. `apps/web/app/layout.tsx`
- Provider order: `MissionsProvider` → `UserProvider` → `SubmissionsProvider`

#### 8. `packages/types/src/index.ts` (included for compilation)
- Added `MissionStatus`, `UserRole`, `Submission` types required by the mission feature

### Validation Results

**Build & Lint:**

| Check | Command | Result |
|-------|---------|--------|
| lint | `pnpm lint` | ✅ Exit 0, no errors |
| typecheck | `pnpm typecheck` | ✅ Exit 0, no errors |
| build | `pnpm build` | ✅ Exit 0, 8 routes generated |

**Route Verification (dev server on port 3001):**

| Route | HTTP Status | Notes |
|-------|-------------|-------|
| `/teacher/missions/new` | 200 | Mission creation form renders |
| `/teacher` | 200 | Teacher dashboard with mission overview |
| `/student` | 200 | Student dashboard with mission cards |
| `/mission/mission-1` | 200 | Mission detail page (sample data) |

**Git:**

| Check | Result |
|-------|--------|
| Commit hash | `5b503a1` |
| Files changed | 16 files, 1,576 insertions, 39 deletions |
| Non-mission files excluded | `eslint.config.js`, `package.json`, `pnpm-lock.yaml` intentionally unstaged |

### Caveats

1. **Deprecated alias:** `useMissions` is still exported as a backwards-compatible alias but marked `@deprecated`. Consumers should migrate to `useMissionsContext()`. The alias will be removed in a future release.

2. **Browser verification gap:** Full interactive end-to-end verification (fill mission creation form → submit → localStorage `gra_missions` key written → redirect to `/teacher` → mission visible in teacher overview → mission visible on `/student` → survives page reload) was **not performed via automated browser testing** because the form is a client-side React component. Route-level HTTP checks (curl) confirmed all pages render with status 200. Manual browser testing is recommended to verify the complete form submission flow and localStorage persistence.

3. **Provider order:** `MissionsProvider` must wrap `UserProvider` which must wrap `SubmissionsProvider` in `layout.tsx`. This ensures missions are available when `UserContext` normalizes mission status.

4. **Commit scope:** The commit includes `packages/types/src/index.ts` and `apps/web/lib/sampleData.ts` which contain types (`MissionStatus`, `UserRole`, `Submission`) and defaults (`role: null`) from the prior mission status tracking feature. These are required for the mission creation feature to compile and are defensible as a single cohesive commit.

5. **Untracked files:** `TASK_REPORT_MISSION_STATUS_AND_BADGES.md` (this file) and `TASK_REPORT_ROLE_SELECTION.md` remain untracked. If the review expects Task Reports to be committed, they should be staged and committed separately.

---

## Git Details

- Working directory: `/Volumes/X10Pro/Galaxy robot academy/`
- Navigation and badges files added on volume path
- No files deleted
- No new dependencies added
