import { NextResponse, type NextRequest } from "next/server";
import { canTeach } from "@galaxy/types";
import { getSessionUser } from "@/lib/firebase/session";
import { createSubmission, listAllSubmissions, listOwnSubmissions } from "@/lib/firebase/submissions";
import { getSubmissionCodeError, getSubmissionReflectionError } from "@/lib/submissionLogic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: students receive only their own submissions; teachers/admins receive
// every submission enriched with student names and quiz progress.
export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const submissions = canTeach(session.role)
    ? await listAllSubmissions()
    : await listOwnSubmissions(session.uid);
  return NextResponse.json({ submissions });
}

// POST: create the caller's own homework submission. The owner uid always
// comes from the verified session — never from the request body.
export async function POST(req: NextRequest) {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  if (session.role !== "student") {
    return NextResponse.json({ error: "Only students submit homework" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    missionId?: string;
    codeSnippet?: string;
    reflection?: string;
  } | null;
  if (!body || typeof body.missionId !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const codeSnippet = typeof body.codeSnippet === "string" ? body.codeSnippet.trim() : "";
  const reflection = typeof body.reflection === "string" ? body.reflection.trim() : "";
  const codeError = getSubmissionCodeError(codeSnippet);
  if (codeError) return NextResponse.json({ error: codeError }, { status: 400 });
  const reflectionError = getSubmissionReflectionError(reflection);
  if (reflectionError) return NextResponse.json({ error: reflectionError }, { status: 400 });

  const result = await createSubmission({
    uid: session.uid,
    missionId: body.missionId,
    codeSnippet,
    reflection,
  });
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  return NextResponse.json({ submission: result.submission }, { status: 201 });
}
