import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getRankByGE } from "@galaxy/config";
import type { QuizProgress } from "@galaxy/types";
import { getSessionUser } from "@/lib/firebase/session";
import { adminDb } from "@/lib/firebase/admin";
import { getQuizById } from "@/lib/serverQuizzes";
import { applyQuizAttempt, gradeQuiz } from "@/lib/quizLogic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: grade a quiz attempt server-side and persist progress on the
// student's profile. The GE reward is applied in a transaction, exactly
// once — retries update attempts/bestScore but can never farm GE.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  if (session.role !== "student") {
    return NextResponse.json({ error: "Only students take quizzes" }, { status: 403 });
  }

  const { quizId } = await params;
  const quiz = getQuizById(quizId);
  if (!quiz) return NextResponse.json({ error: "Unknown quiz" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    answers?: Record<string, string[]>;
  } | null;
  if (!body || typeof body.answers !== "object" || body.answers === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const answers: Record<string, string[]> = {};
  for (const [questionId, selected] of Object.entries(body.answers)) {
    if (Array.isArray(selected)) {
      answers[questionId] = selected.filter((id): id is string => typeof id === "string");
    }
  }

  const grade = gradeQuiz(quiz, answers);
  const attemptAt = new Date().toISOString();
  const studentRef = adminDb.collection("students").doc(session.uid);

  const outcome = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(studentRef);
    if (!snap.exists) return null;
    const data = snap.data() ?? {};
    const progress = (data.progress ?? {}) as { quizzes?: Record<string, QuizProgress> };
    const previous = progress.quizzes?.[quiz.quizId];
    const result = applyQuizAttempt(previous, grade, quiz.rewardGE, attemptAt);

    const patch: Record<string, unknown> = {
      [`progress.quizzes.${quiz.quizId}`]: result.progress,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (result.geDelta > 0) {
      const gamification = (data.gamification ?? {}) as { totalGE?: number };
      const totalGE = (gamification.totalGE ?? 0) + result.geDelta;
      patch["gamification.totalGE"] = totalGE;
      patch["gamification.rankId"] = getRankByGE(totalGE);
      patch["gamification.lastActivityAt"] = FieldValue.serverTimestamp();
    }
    tx.update(studentRef, patch);
    return result;
  });

  if (!outcome) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

  return NextResponse.json({
    score: grade.score,
    total: grade.total,
    passed: grade.passed,
    results: grade.results,
    geAwarded: outcome.geDelta,
    progress: outcome.progress,
  });
}
