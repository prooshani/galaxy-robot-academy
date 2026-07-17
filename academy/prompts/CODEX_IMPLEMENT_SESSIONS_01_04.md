# Codex Work Order
## Implement Sessions 01–04 on the Galaxy Robot Academy Website

## Repository root

```text
/Volumes/X10Pro/Galaxy robot academy/
```

Run:

```bash
cd "/Volumes/X10Pro/Galaxy robot academy"
pwd
git rev-parse --show-toplevel
git status --short
git branch --show-current
git log --oneline -5
```

Confirm the repository root exactly matches the path above.

## Objective

Integrate the approved curriculum and complete materials for Sessions 01–04 into the existing website.

Students must be able to:

- open each mission;
- read objectives and tasks;
- complete its quiz;
- receive quiz feedback;
- complete homework;
- submit code and reflection;
- see submission status;
- receive teacher feedback, GE, and badges;
- revise and resubmit.

Teachers must be able to:

- inspect homework submissions;
- review code and reflection;
- approve or request revision;
- award GE;
- award the correct badge;
- leave feedback.

## Approved sources

```text
academy/curriculum/
materials/session-01/
materials/session-02/
materials/session-03/
materials/session-04/
```

Each session includes teacher-only material and `WEBSITE_CONTENT.md`. Student UI must not expose teacher guides or answer guides.

Read and follow:

```text
docs/engineering/
docs/design/
academy/README.md
```

Inspect and reuse the existing:

- authentication;
- roles and authorization;
- content model;
- mission adapter;
- quiz implementation, if present;
- homework/submission model;
- teacher review flow;
- GE and badge services;
- Firebase/Firestore data access;
- route protection;
- tests.

Do not build parallel contexts, duplicate content catalogs, or a second submission system.

## Implementation plan required

Before editing, output:

1. current mission content flow;
2. current quiz architecture;
3. current homework/submission architecture;
4. authenticated identity and authorization flow;
5. current GE and badge awarding;
6. stable IDs and migration implications;
7. expected files;
8. validation strategy;
9. conflicts requiring a decision.

If a material conflict exists, stop and report it instead of guessing.

## Stable IDs

```text
mission-01
mission-02
mission-03
mission-04

quiz-01
quiz-02
quiz-03
quiz-04

homework-01
homework-02
homework-03
homework-04
```

Badges:

```text
first-contact
memory-engineer
signal-operator
logic-navigator
```

## Mission integration

For each session, render canonical:

- mission title and number;
- summary;
- learning objectives;
- required tasks;
- bonus tasks;
- estimated duration;
- reward GE;
- badge opportunity;
- robot upgrade;
- prerequisites;
- R0-B0 messages;
- quiz status;
- homework status;
- next action.

Curriculum content must be structured data consumed through the existing content layer. Do not hardcode session text inside React pages.

## Quiz implementation

Create four structured quizzes from each `QUICK_QUIZ.md`.

Requirements:

- 7 questions per session;
- passing score 5/7;
- unlimited attempts;
- immediate answer feedback and explanations;
- code blocks preserve formatting;
- authenticated student progress persists;
- one GE reward per quiz;
- retries cannot farm GE;
- quiz status is shown on mission and student progress views;
- accessible keyboard operation;
- loading, empty, error, completed, and retry states.

Use supported question types from the existing engine. Prefer multiple choice, select-all, output prediction, ordering, and bug identification. Do not introduce unreliable free-text automatic grading.

## Homework implementation

Create one homework experience per session.

### Session 01
Fields:
- `code`
- `favoriteLineExplanation`

### Session 02
Fields:
- `code`
- `variableNameReflection`

### Session 03
Fields:
- `code`
- `interactivityReflection`

### Session 04
Fields:
- `code`
- `ruleDesignReflection`

Requirements:

- draft support if consistent with current architecture;
- authenticated student ownership;
- submission timestamp;
- monospace code display;
- separate reflection display;
- prevent accidental duplicate active submissions;
- revision and resubmission;
- teacher feedback;
- awarded GE and badges;
- status visible to students;
- submission history preserved if already supported.

## Teacher review

Teacher Mission Control must show:

- student identity;
- session and mission;
- code;
- reflection;
- submitted timestamp;
- current status;
- quiz completion and score;
- prior feedback;
- badge opportunity;
- GE award.

Review actions:

- approve;
- approve as excellent;
- request revision;
- save feedback;
- award GE once;
- award badge once;
- cancel safely.

Do not trust client-selected teacher role alone. Use existing authorization.

## Progression

Use the existing approved unlock policy.

Expected sequence:

```text
Mission 01 → Mission 02 → Mission 03 → Mission 04
```

Do not invent a second progression source.

Mission, quiz, and homework statuses must be visible on the student dashboard.

## R0-B0 dialogue

Use each session’s approved messages for:

- before start;
- in progress;
- submitted;
- needs revision;
- completed.

Messages must derive from actual state.

## Security and data integrity

Verify:

- students can access only their own submissions;
- teachers access only authorized review operations;
- route/form IDs are validated;
- GE and badge operations are idempotent;
- resubmission does not duplicate rewards;
- no secrets are committed;
- Firestore/server rules align with UI permissions;
- localStorage is not canonical for authenticated progress where Firebase is active.

## UX

Follow `docs/design/`.

Ensure:

- responsive layout;
- clear child-friendly language;
- visible focus;
- associated labels;
- readable code;
- non-color status indicators;
- reduced motion;
- access-denied state;
- loading/error/empty states.

## Constraints

- Do not expose `ANSWER_GUIDE.md` or `TEACHER_GUIDE.md` to students.
- Do not change authentication architecture.
- Do not weaken authorization.
- Do not add a second content system.
- Do not duplicate content in React components.
- Do not implement Python execution in this task unless a vetted engine already exists.
- Do not alter Sessions 05–12.
- Do not add major dependencies without explicit justification.

## Acceptance criteria

- Sessions 01–04 display approved content.
- Four quizzes work end-to-end.
- Quiz reward is idempotent.
- Four homework forms work end-to-end.
- Student ownership is enforced.
- Teacher review works.
- Revision and resubmission work.
- GE and badges are awarded once.
- Progression and status display correctly.
- R0-B0 messages match state.
- Existing sign-in, onboarding, roles, dashboards, navigation, and UI remain functional.
- Accessibility and responsive behavior pass.

## Validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run all tests.

Add focused tests for:

- quiz scoring;
- quiz reward idempotency;
- submission ownership;
- review transitions;
- GE idempotency;
- badge idempotency;
- revision/resubmission;
- mission unlock sequence.

Manual verification:

1. Student signs in.
2. Completes a failing quiz and retries.
3. Completes a passing quiz.
4. Submits Session 01 homework.
5. Teacher requests revision.
6. Student resubmits.
7. Teacher approves and awards GE/badge.
8. Student sees feedback and next mission.
9. Repeat representative checks for Sessions 02–04.

Capture screenshots for mission, quiz, homework, teacher review, revision, approval, and student feedback.

## Deliverables

- canonical structured Session 01–04 content;
- four quizzes;
- four homework experiences;
- submission/review integration;
- tests;
- screenshots;
- complete Task Report.

## Task Report status

```text
READY FOR ARCHITECT REVIEW
```

Do not push unless requested.
