# Codex Review Work Order
## Review Sessions 01–04 Website Integration

## Repository root

```text
/Volumes/X10Pro/Galaxy robot academy/
```

Run preflight and review the implementation commits against their parent commits.

Do not modify code during the initial review.

## Authoritative sources

```text
academy/curriculum/
materials/session-01/
materials/session-02/
materials/session-03/
materials/session-04/
docs/engineering/
docs/design/
```

## Review

### Content fidelity

Verify:

- stable mission, quiz, homework, and badge IDs;
- objectives, tasks, rewards, and R0-B0 messages match approved material;
- teacher guides and answers are not exposed;
- curriculum is not duplicated in page components.

### Quizzes

For all four:

- exactly 7 approved questions or a clearly justified equivalent preserving all learning checks;
- passing score 5/7;
- unlimited retries;
- feedback;
- formatting;
- persistent per-student progress;
- GE once;
- no reward farming;
- accessibility.

### Homework

Verify:

- correct fields per session;
- authenticated ownership;
- status and timestamps;
- draft/submit behavior;
- duplicate protection;
- revision/resubmission;
- feedback;
- code presentation.

### Teacher review

Verify:

- authorization;
- student and mission identity;
- quiz context;
- code and reflection;
- approve/excellent/revision actions;
- feedback;
- GE once;
- badge once;
- safe repeated actions.

### Security

Verify:

- students cannot access other submissions;
- students cannot invoke teacher actions;
- authorization is not based only on client role;
- server/Firestore rules match;
- route and form IDs are validated;
- no secrets.

### Regression

Verify:

- sign-in/sign-up;
- onboarding;
- route protection;
- student cockpit;
- teacher mission control;
- badges;
- GE;
- navigation;
- existing content and design;
- responsive behavior;
- hydration.

## Validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run all tests.

Inspect focused tests for scoring, idempotency, ownership, review transitions, revisions, and unlocks.

## Output

### Verdict

Use one:

```text
APPROVED
APPROVED WITH NON-BLOCKING NOTES
CHANGES REQUIRED
```

### Findings

For each:

- severity;
- file;
- line/symbol;
- problem;
- impact;
- required correction.

### Evidence

List exact commands and outcomes.

### Session assessment

Assess Sessions 01, 02, 03, and 04 separately.

### Security assessment

State whether the implementation is safe for real student accounts.

### Regression assessment

State whether previous workflows remain intact.

### Corrective prompt

If changes are required, produce one complete, focused Codex implementation prompt addressing only confirmed findings.

If approved:

```text
No corrective Codex prompt is required.
```
