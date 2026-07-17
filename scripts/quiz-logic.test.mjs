import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

function run(script) {
  const output = execFileSync(
    process.execPath,
    ["--experimental-strip-types", "--input-type=module", "-e", script],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  return JSON.parse(output);
}

const QUIZ = `const quiz = {
  quizId: "quiz-01",
  missionId: "mission-01",
  title: "Test quiz",
  passingScore: 2,
  rewardGE: 10,
  questions: [
    { questionId: "q1", type: "multiple-choice", prompt: "?", options: [{id:"a",label:"A"},{id:"b",label:"B"}], correctOptionIds: ["a"], explanation: "e1" },
    { questionId: "q2", type: "select-all", prompt: "?", options: [{id:"a",label:"A"},{id:"b",label:"B"},{id:"c",label:"C"}], correctOptionIds: ["a","c"], explanation: "e2" },
    { questionId: "q3", type: "multiple-choice", prompt: "?", options: [{id:"a",label:"A"},{id:"b",label:"B"}], correctOptionIds: ["b"], explanation: "e3" },
  ],
};`;

test("gradeQuiz scores exact matches, select-all sets, and unanswered questions", () => {
  const result = run(`import { gradeQuiz } from "./apps/web/lib/quizLogic.ts";
${QUIZ}
console.log(JSON.stringify({
  perfect: gradeQuiz(quiz, { q1: ["a"], q2: ["c", "a"], q3: ["b"] }),
  partialSelectAll: gradeQuiz(quiz, { q1: ["a"], q2: ["a"], q3: ["b"] }),
  overSelected: gradeQuiz(quiz, { q1: ["a"], q2: ["a", "b", "c"], q3: ["b"] }),
  unanswered: gradeQuiz(quiz, { q1: ["a"] }),
  wrong: gradeQuiz(quiz, { q1: ["b"], q2: ["b"], q3: ["a"] }),
}));`);
  assert.equal(result.perfect.score, 3);
  assert.equal(result.perfect.passed, true);
  // Select-all requires the exact set: missing or extra picks are incorrect.
  assert.equal(result.partialSelectAll.score, 2);
  assert.equal(result.overSelected.score, 2);
  assert.equal(result.unanswered.score, 1);
  assert.equal(result.unanswered.passed, false);
  assert.equal(result.wrong.score, 0);
  assert.equal(result.wrong.results.every((r) => !r.correct), true);
});

test("applyQuizAttempt awards GE exactly once and never on retries", () => {
  const result = run(`import { applyQuizAttempt } from "./apps/web/lib/quizLogic.ts";
const t = "2026-07-13T00:00:00.000Z";
const fail = applyQuizAttempt(undefined, { score: 3, passed: false }, 10, t);
const firstPass = applyQuizAttempt(fail.progress, { score: 5, passed: true }, 10, t);
const retryPass = applyQuizAttempt(firstPass.progress, { score: 7, passed: true }, 10, t);
const failAfterPass = applyQuizAttempt(retryPass.progress, { score: 2, passed: false }, 10, t);
console.log(JSON.stringify({ fail, firstPass, retryPass, failAfterPass }));`);
  assert.equal(result.fail.geDelta, 0);
  assert.equal(result.fail.progress.passed, false);
  assert.equal(result.fail.progress.attempts, 1);

  assert.equal(result.firstPass.geDelta, 10);
  assert.equal(result.firstPass.progress.geAwarded, true);

  // Retrying a passed quiz can improve bestScore but never re-earns GE.
  assert.equal(result.retryPass.geDelta, 0);
  assert.equal(result.retryPass.progress.bestScore, 7);
  assert.equal(result.retryPass.progress.attempts, 3);

  // A failed attempt after passing removes nothing.
  assert.equal(result.failAfterPass.geDelta, 0);
  assert.equal(result.failAfterPass.progress.passed, true);
  assert.equal(result.failAfterPass.progress.geAwarded, true);
  assert.equal(result.failAfterPass.progress.bestScore, 7);
});

test("student quiz shape contains no answer keys or explanations", () => {
  const result = run(`import { toStudentQuiz } from "./apps/web/lib/quizLogic.ts";
import { quiz1 } from "./academy/quizzes/quiz-01.ts";
import { quiz2 } from "./academy/quizzes/quiz-02.ts";
import { quiz3 } from "./academy/quizzes/quiz-03.ts";
import { quiz4 } from "./academy/quizzes/quiz-04.ts";
const stripped = [quiz1, quiz2, quiz3, quiz4].map((q) => toStudentQuiz(q));
const serialized = JSON.stringify(stripped);
console.log(JSON.stringify({
  hasCorrect: serialized.includes("correctOptionIds"),
  hasExplanation: serialized.includes("explanation"),
  questionCounts: stripped.map((q) => q.questions.length),
  optionCountsOk: stripped.every((q) => q.questions.every((question) => question.options.length >= 2)),
  keepsMeta: stripped.every((q) => typeof q.passingScore === "number" && typeof q.rewardGE === "number"),
}));`);
  assert.equal(result.hasCorrect, false);
  assert.equal(result.hasExplanation, false);
  assert.deepEqual(result.questionCounts, [7, 7, 7, 7]);
  assert.equal(result.optionCountsOk, true);
  assert.equal(result.keepsMeta, true);
});

test("canonical quizzes ship 7 questions, pass at 5, reward 10 GE", () => {
  const result = run(`import { quiz1 } from "./academy/quizzes/quiz-01.ts";
import { quiz2 } from "./academy/quizzes/quiz-02.ts";
import { quiz3 } from "./academy/quizzes/quiz-03.ts";
import { quiz4 } from "./academy/quizzes/quiz-04.ts";
const academyQuizzes = [quiz1, quiz2, quiz3, quiz4];
console.log(JSON.stringify(academyQuizzes.map((q) => ({
  quizId: q.quizId,
  missionId: q.missionId,
  questions: q.questions.length,
  passingScore: q.passingScore,
  rewardGE: q.rewardGE,
  everyQuestionHasCorrectOption: q.questions.every((question) =>
    question.correctOptionIds.length >= 1 &&
    question.correctOptionIds.every((id) => question.options.some((o) => o.id === id))
  ),
}))));`);
  assert.equal(result.length, 4);
  for (const [index, quiz] of result.entries()) {
    assert.equal(quiz.quizId, `quiz-0${index + 1}`);
    assert.equal(quiz.missionId, `mission-0${index + 1}`);
    assert.equal(quiz.questions, 7);
    assert.equal(quiz.passingScore, 5);
    assert.equal(quiz.rewardGE, 10);
    assert.equal(quiz.everyQuestionHasCorrectOption, true);
  }
});
