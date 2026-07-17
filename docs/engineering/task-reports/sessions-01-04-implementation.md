# Task Report — Implement Sessions 01–04

**Status:** READY FOR ARCHITECT REVIEW

## Summary

Sessions 01–04 are integrated end-to-end: approved mission content, four structured quizzes with server-graded attempts and one-time GE rewards, four homework experiences with per-session reflection fields, Firestore-backed submissions with student ownership, teacher review with idempotent GE/badge awards, revision → resubmission, and state-driven R0-B0 dialogue.

## Stable IDs and migration

- Missions 1–4 renamed to the approved `mission-01`…`mission-04`; quizzes `quiz-01`…`quiz-04`; homework `homework-01`…`homework-04`; badges `first-contact`, `memory-engineer`, `signal-operator`, `logic-navigator`. Sessions 05–12 untouched.
- Legacy IDs (`mission-1`…`mission-4`, `badge-start`, `badge-logic`) are migrated at read time via `apps/web/lib/legacyIds.ts` — applied to Firestore progress keys, localStorage state, stored badge lists, and old `/mission/mission-1` links. No destructive data migration required.
- Course manifest updated (version 2).

## Architecture decisions

1. **Submissions moved to Firestore** (collection `submissions`) via server API routes using the Admin SDK — the previous localStorage store could not support cross-user teacher review and violated the "localStorage is not canonical" rule. `SubmissionsContext` keeps its provider interface but is now API-backed.
2. **Gamification is server-authoritative.** The client no longer syncs GE/badges/rank; `/api/user/progress` accepts mission status/tasks only. GE is written exclusively by:
   - `POST /api/quizzes/[quizId]/attempt` — server-side grading, transaction awards quiz GE once (first passing attempt); retries update attempts/bestScore only.
   - `PATCH /api/submissions/[id]` (teacher review) — transaction awards homework GE and mission badges once, locked when a submission becomes `reviewed`.
3. **No quiz engine existed** — one was created: structured `multiple-choice` / `select-all` questions (output-prediction and bug-fix expressed as MC with code blocks), no free-text auto-grading. 7 questions/quiz, pass 5/7, unlimited attempts, 10 GE once.
4. **Firestore rules**: `submissions` is server-only (client SDK denied); ownership/review authorization enforced in the API from the verified session cookie, never from client-supplied IDs or roles.

## Files

- Content: `academy/missions/01–04`, `academy/quizzes/` (new), `academy/homework/index.ts`, `academy/badges/index.ts`, `academy/curriculum/galaxy-robot-academy.ts`
- Types: `packages/types/src/index.ts` (Quiz, QuizProgress, RobotMessages, submission reflection fields)
- Logic: `apps/web/lib/quizLogic.ts`, `submissionLogic.ts`, `legacyIds.ts`, `firebase/submissions.ts`, `academyContent.ts`
- API: `app/api/submissions/`, `app/api/submissions/[submissionId]/`, `app/api/quizzes/[quizId]/attempt/`, `app/api/user/progress/`
- UI: quiz page `app/mission/[missionId]/quiz/`, `MissionSubmissionForm.tsx` (reflection + local draft + resubmit), mission page (quiz panel, R0-B0 messages, next action), student dashboard (quiz/homework chips), teacher Mission Control (reflection, quiz score, approve-as-excellent, badge info, async review)
- Security: `firestore.rules`
- Tests: `scripts/quiz-logic.test.mjs`, `scripts/submission-logic.test.mjs` (replaces `teacher-review.test.mjs`), `scripts/validate-curriculum.mjs` extended (quiz structure, approved IDs, reflection fields)

## Validation

- `pnpm typecheck` ✅ · `eslint` ✅ (no issues) · `pnpm build` ✅ · `node --test scripts/*.test.mjs` ✅ 11/11 · `node scripts/validate-curriculum.mjs` ✅
- Browser smoke test: homepage + login render cleanly, zero console errors; unauthenticated API calls correctly return 401.

## Outstanding — needs a human with credentials

Signed-in end-to-end verification (student quiz fail/pass, homework submit, teacher revision request, resubmit, approve with GE/badge) and the corresponding screenshots could not be executed autonomously: authentication requires entering account credentials. Manual pass per the work order's "Manual verification" checklist is required.

Not pushed. Working tree only.

## Corrective review fixes (2026-07-13)

All confirmed review findings were fixed:

1. **Profile fetch failure** no longer hydrates from sample data or guesses "student" — the client stays in `authStatus: "loading"` and retries every 3s, so the progress sync can never PATCH sample data.
2. **Debounced progress-save timer** is cleared on effect cleanup, sign-out, and `refreshProfile()` — a stale PATCH can't overwrite server-refreshed progress.
3. **Session hardening**: `getSessionUser({ strict: true })` (session-cookie `checkRevoked` + rejection of `status: "suspended"` profiles) on every state-changing route (submissions POST/PATCH, quiz attempt, progress/profile PATCH, avatar POST/DELETE, admin POSTs). Read-only routes keep cheap verification.
4. **Quiz answers no longer ship to the client**: canonical quizzes moved behind server-only `lib/serverQuizzes.ts`; the quiz page fetches the stripped `StudentQuiz` shape from `GET /api/quizzes/[quizId]`; correctness/explanations arrive only in the graded attempt response. Verified by scanning built client chunks — no answer keys or explanation text present.
5. **MissionsContext legacy migration** normalizes stored mission IDs (and deleted-ID tombstones), so legacy fixtures are replaced instead of duplicated and teacher edits re-key onto stable IDs.
6. **Submissions**: deterministic doc ID `${uid}_${missionId}` created inside a transaction (atomic duplicate protection), stored-ID normalization in lookup and progress writes, and reviews abort (409) if the student profile is missing instead of locking with a lost award.
7. **Route validation**: resubmission requires a non-empty reflection; approval GE award must be an integer 1–100.

Re-validated: `pnpm typecheck` ✅ · `pnpm build` ✅ · `node scripts/validate-curriculum.mjs` ✅ · `node --test` ✅ 14/14 (new tests: dedup ID derivation, reflection validation, stripped student quiz shape) · dev-server smoke: new/changed routes return 401 unauthenticated, homepage clean.
