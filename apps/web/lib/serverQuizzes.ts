import "server-only";

/**
 * Server-side quiz content adapter.
 *
 * Canonical quizzes carry the answer key (`correctOptionIds`) and
 * explanations, so they must never be imported from client code — this
 * module is server-only. The browser receives the stripped StudentQuiz
 * shape via GET /api/quizzes/[quizId].
 */

import type { Quiz } from "@galaxy/types";
import { academyQuizzes } from "@academy/quizzes";
import { normalizeMissionId } from "./legacyIds";
import { toStudentQuiz, type StudentQuiz } from "./quizLogic";

/**
 * All canonical quizzes as a plain array (not readonly).
 */
export const canonicalQuizzes: Quiz[] = academyQuizzes.map((quiz) => ({
  ...quiz,
  questions: quiz.questions.map((q) => ({
    ...q,
    type: parseQuestionType(q.type),
    options: q.options.map((o) => ({ ...o })),
    correctOptionIds: [...q.correctOptionIds],
  })),
}));

function parseQuestionType(value: string): Quiz["questions"][number]["type"] {
  if (value === "multiple-choice" || value === "select-all") return value;
  throw new Error(`Invalid quiz question type: ${value}`);
}

/**
 * Lookup a quiz by its quizId.
 */
export function getQuizById(id: string): Quiz | undefined {
  return canonicalQuizzes.find((q) => q.quizId === id);
}

/**
 * Lookup a quiz by the mission it belongs to (legacy IDs are normalized).
 */
export function getQuizByMissionId(missionId: string): Quiz | undefined {
  const normalized = normalizeMissionId(missionId);
  return canonicalQuizzes.find((q) => q.missionId === normalized);
}

/**
 * Student-facing quiz (no answer key, no explanations) by quizId.
 */
export function getStudentQuizById(id: string): StudentQuiz | undefined {
  const quiz = getQuizById(id);
  return quiz ? toStudentQuiz(quiz) : undefined;
}
