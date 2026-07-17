import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/firebase/session";
import { getStudentQuizById } from "@/lib/serverQuizzes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: the student-facing quiz — questions and options only. The answer key
// and explanations stay server-side; they come back per-question from the
// attempt endpoint after grading.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { quizId } = await params;
  const quiz = getStudentQuizById(quizId);
  if (!quiz) return NextResponse.json({ error: "Unknown quiz" }, { status: 404 });

  return NextResponse.json({ quiz });
}
