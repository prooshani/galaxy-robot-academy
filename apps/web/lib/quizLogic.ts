/**
 * Quiz grading + progress logic.
 *
 * Pure functions shared by the quiz UI (immediate feedback) and the
 * attempt API (authoritative grading, idempotent GE award). No React,
 * no Firebase, no mutable state — unit-testable with node --test.
 */

import type { Quiz, QuizProgress, QuizQuestion } from "@galaxy/types";

/**
 * Student-facing quiz shape: what the browser is allowed to see.
 * `correctOptionIds` and `explanation` NEVER leave the server — correctness
 * and explanations come back per-question in the attempt response.
 */
export type StudentQuizQuestion = Omit<QuizQuestion, "correctOptionIds" | "explanation">;
export type StudentQuiz = Omit<Quiz, "questions"> & { questions: StudentQuizQuestion[] };

/** Strip the answer key + explanations from a canonical quiz. */
export function toStudentQuiz(quiz: Quiz): StudentQuiz {
  return {
    quizId: quiz.quizId,
    missionId: quiz.missionId,
    title: quiz.title,
    passingScore: quiz.passingScore,
    rewardGE: quiz.rewardGE,
    questions: quiz.questions.map((q) => ({
      questionId: q.questionId,
      type: q.type,
      prompt: q.prompt,
      ...(q.code !== undefined ? { code: q.code } : {}),
      options: q.options.map((o) => ({ ...o })),
    })),
  };
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  correctOptionIds: string[];
  selectedOptionIds: string[];
  explanation: string;
}

export interface QuizGrade {
  score: number;
  total: number;
  passed: boolean;
  results: QuestionResult[];
}

/** A question is correct when the selected set exactly matches the correct set. */
export function isQuestionCorrect(question: QuizQuestion, selected: string[]): boolean {
  const chosen = new Set(selected);
  if (chosen.size !== question.correctOptionIds.length) return false;
  return question.correctOptionIds.every((id) => chosen.has(id));
}

/** Grade a full attempt. Unanswered questions count as incorrect. */
export function gradeQuiz(quiz: Quiz, answers: Record<string, string[]>): QuizGrade {
  const results = quiz.questions.map((question) => {
    const selected = Array.isArray(answers[question.questionId]) ? answers[question.questionId] : [];
    return {
      questionId: question.questionId,
      correct: isQuestionCorrect(question, selected),
      correctOptionIds: [...question.correctOptionIds],
      selectedOptionIds: [...selected],
      explanation: question.explanation,
    };
  });
  const score = results.filter((r) => r.correct).length;
  return {
    score,
    total: quiz.questions.length,
    passed: score >= quiz.passingScore,
    results,
  };
}

export const EMPTY_QUIZ_PROGRESS: QuizProgress = {
  attempts: 0,
  bestScore: 0,
  passed: false,
  geAwarded: false,
  lastAttemptAt: null,
};

export interface QuizAttemptOutcome {
  progress: QuizProgress;
  /** GE to add to the student's total for THIS attempt (0 on retries). */
  geDelta: number;
}

/**
 * Fold one graded attempt into the stored progress.
 *
 * The GE reward is granted exactly once: on the first attempt that passes
 * while `geAwarded` is still false. Retries can improve `bestScore` but can
 * never re-earn GE, and a failed attempt never removes anything.
 */
export function applyQuizAttempt(
  previous: QuizProgress | undefined,
  grade: Pick<QuizGrade, "score" | "passed">,
  rewardGE: number,
  attemptAt: string,
): QuizAttemptOutcome {
  const prior = previous ?? EMPTY_QUIZ_PROGRESS;
  const earnsReward = grade.passed && !prior.geAwarded;
  return {
    progress: {
      attempts: prior.attempts + 1,
      bestScore: Math.max(prior.bestScore, grade.score),
      passed: prior.passed || grade.passed,
      geAwarded: prior.geAwarded || earnsReward,
      lastAttemptAt: attemptAt,
    },
    geDelta: earnsReward ? rewardGE : 0,
  };
}
