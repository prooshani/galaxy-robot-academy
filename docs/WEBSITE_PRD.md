# Galaxy Robot Academy Website PRD

## Objective

Build a galaxy-themed learning platform where students complete software missions, submit homework, earn Galaxy Energy, unlock badges, and watch R0-B0 evolve.

The first version serves one teacher and two students, but the architecture should not block future cohorts.

## Technology

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons

Backend:

- Firebase Authentication
- Firestore
- Firebase Storage, if file uploads become necessary

Deployment:

- Vercel for the web app
- Firebase for auth and data

## User Roles

Student:

- Sees current mission
- Reads mission briefings
- Submits homework
- Tracks Galaxy Energy
- Tracks rank
- Views badges
- Views R0-B0 upgrades

Teacher:

- Creates or publishes missions
- Reviews submissions
- Awards GE
- Awards badges
- Leaves comments
- Tracks student progress

Parent, future:

- Views progress summary
- Sees badges, ranks, and completed missions

## Sitemap

```text
/
/login
/student
/student/missions
/student/missions/[missionId]
/student/badges
/student/robot
/student/profile
/teacher
/teacher/missions
/teacher/submissions
/teacher/students
/teacher/badges
```

## Student Dashboard

The dashboard should feel like mission control, not a school portal.

Required elements:

- Greeting by engineer name
- Current rank
- Current GE
- Next rank progress
- Current mission
- Homework status
- Recent badges
- R0-B0 current upgrade
- Recent mission log

## Mission Page

Each mission includes:

- Mission title
- Story briefing
- Learning objective
- Required tasks
- Optional bonus challenge
- Reward GE
- Badge opportunity
- Submission form

For MVP, students can paste code and notes into the browser. A full in-browser Python runner can be a later feature.

## Teacher Review Flow

1. Student submits mission work.
2. Teacher opens submission.
3. Teacher reviews code and notes.
4. Teacher selects status: needs changes, approved, excellent.
5. Teacher awards GE.
6. Teacher optionally awards badges.
7. Student sees feedback and rewards.

## Data Model Draft

```text
users/{userId}
  role
  displayName
  email
  cohortId
  totalGE
  rank
  createdAt

cohorts/{cohortId}
  name
  teacherIds
  studentIds
  activeCourseId

missions/{missionId}
  title
  sessionNumber
  story
  objectives
  requiredTasks
  bonusTasks
  rewardGE
  badgeIds
  status

submissions/{submissionId}
  missionId
  studentId
  cohortId
  code
  notes
  status
  teacherComment
  awardedGE
  awardedBadgeIds
  submittedAt
  reviewedAt

badges/{badgeId}
  name
  category
  description
  hidden
  icon

studentBadges/{studentBadgeId}
  studentId
  badgeId
  awardedBy
  awardedAt
```

## Visual Direction

The app should feel like a premium space mission dashboard for children.

Use:

- Dark galaxy background
- Bright mission accents
- Robot upgrade visuals
- Clear progress indicators
- Smooth but restrained animations
- Friendly language

Avoid:

- School portal styling
- Heavy text walls
- Punishment language
- Overly childish UI
- Distracting animations during reading or coding

## MVP Scope

MVP should include:

- Login
- Student dashboard
- Teacher dashboard
- Mission list
- Mission detail
- Text/code submission
- Teacher review
- GE tracking
- Badge awarding
- R0-B0 status panel

Out of scope for MVP:

- In-browser Python execution
- AI companion
- Multiplayer features
- Parent dashboard
- Payment or public enrollment

## Launch Readiness

### Architecture (Confirmed)

- **Framework**: Next.js 16, React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first import via `@import "tailwindcss"` in `globals.css`)
- **State**: React Context with localStorage persistence (`gra_userState`, `gra_missions`, `gra_submissionsState`)
- **Monorepo**: `apps/web` + `packages/config` + `packages/types` + `packages/ui`
- **Path alias**: `@/*` → `./*`
- **Provider hierarchy**: `MissionsProvider` → `UserProvider` → `SubmissionsProvider` → `RoleGuard` → `NavBar` → `{children}`
- **Deployment target**: Vercel (web app) + Firebase (auth/data, future)

### Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| Home page | ✅ | Role-aware greeting, navigation cards |
| Role selection | ✅ | Student/Teacher toggle with `RoleGuard` |
| Student dashboard | ✅ | Mission cards with progress indicators |
| Mission detail | ✅ | Story, objectives, tasks, rewards, submission form |
| Code submission | ✅ | Paste code into textarea, teacher review flow |
| Teacher dashboard | ✅ | Mission overview, submissions table |
| Create/edit missions | ✅ | Full form with badge selection |
| Badge collection | ✅ | Unlocked/locked display with stats |
| GE tracking | ✅ | Persistent in localStorage |
| Task completion | ✅ | Required + bonus task toggles |
| 404 page | ✅ | Custom not-found with navigation |

### Accessibility Audit (Completed)

All interactive elements now include:

- **Focus-visible rings**: Every `<button>`, `<Link>`, and `<input>` has `focus-visible:ring-*` + `focus-visible:outline-none`
- **Label associations**: All form inputs have matching `<label htmlFor>` / `<input id>` pairs, including badge reward checkboxes (fixed in batch 15)
- **ARIA labels**: All buttons and links have descriptive `aria-label` attributes
- **Link migration**: All native `<a href>` tags replaced with Next.js `<Link>` components
- **Decorative elements**: Emoji icons use `aria-hidden="true"`
- **Removed anti-pattern**: `tabIndex={0}` removed from non-interactive `<article>` elements on the badges page (WCAG 2.4.3)

### Known Limitations

1. **No authentication** — Role is set manually via `/role`. No Firebase Auth integration yet.
2. **Single-user localStorage** — All data persists in the browser's localStorage. No server-side persistence.
3. **No R0-B0 robot panel** — Referenced in PRD but not yet implemented.
4. **No parent dashboard** — Referenced in PRD as future scope.
5. **No multi-cohort support** — Architecture doesn't yet support multiple teacher/student cohorts.
6. **No Firebase backend** — Auth and Firestore integration planned for post-MVP.
7. **Project path contains spaces** — `/Volumes/X10Pro/galaxy robot academy/` — terminal commands require quoting.

### Future Scope

- Firebase Authentication and Firestore backend
- R0-B0 robot evolution panel with upgrade visuals
- Parent dashboard for progress summaries
- In-browser Python code execution
- AI companion for student guidance
- Multi-cohort support for multiple classes
- Framer Motion animations (planned but not yet implemented)
- Lucide icon library (planned but not yet implemented)

