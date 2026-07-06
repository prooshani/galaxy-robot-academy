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

