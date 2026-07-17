import { NextResponse, type NextRequest } from "next/server";
import { canTeach } from "@galaxy/types";
import { getSessionUser } from "@/lib/firebase/session";
import { resubmitSubmission, reviewSubmission } from "@/lib/firebase/submissions";
import {
  GE_AWARD_MAX,
  GE_AWARD_MIN,
  getSubmissionCodeError,
  getSubmissionReflectionError,
  type ReviewAction,
} from "@/lib/submissionLogic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REVIEW_ACTIONS: ReviewAction[] = ["approve", "approve_excellent", "request_revision"];

// PATCH: two authorized shapes.
// - Student resubmission (own doc, after a revision request):
//   { resubmit: true, codeSnippet, reflection? }
// - Teacher review:
//   { action: "approve" | "approve_excellent" | "request_revision", feedback, geAward }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { submissionId } = await params;
  if (!submissionId) return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (body.resubmit === true) {
    const codeSnippet = typeof body.codeSnippet === "string" ? body.codeSnippet.trim() : "";
    const codeError = getSubmissionCodeError(codeSnippet);
    if (codeError) return NextResponse.json({ error: codeError }, { status: 400 });

    // A resubmission must carry a non-empty reflection — the field is
    // required, and PATCH must never be able to wipe it.
    const reflection = typeof body.reflection === "string" ? body.reflection.trim() : "";
    const reflectionError = getSubmissionReflectionError(reflection);
    if (reflectionError) return NextResponse.json({ error: reflectionError }, { status: 400 });

    const result = await resubmitSubmission({
      uid: session.uid,
      submissionId,
      codeSnippet,
      reflection,
    });
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
    return NextResponse.json({ submission: result.submission });
  }

  // Teacher review path — authorization from the verified session role only.
  if (!canTeach(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const action = body.action as ReviewAction;
  if (!REVIEW_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Invalid review action" }, { status: 400 });
  }
  const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";
  if (action === "request_revision" && !feedback) {
    return NextResponse.json(
      { error: "Add feedback explaining the requested revision." },
      { status: 400 },
    );
  }
  // Approvals must award a sane amount (matching homework rewardGE guidance);
  // revision requests never award, so the value is forced to zero.
  const geAward = action === "request_revision" ? 0 : Number(body.geAward);
  if (action !== "request_revision" && (!Number.isInteger(geAward) || geAward < GE_AWARD_MIN || geAward > GE_AWARD_MAX)) {
    return NextResponse.json(
      { error: `GE award must be an integer between ${GE_AWARD_MIN} and ${GE_AWARD_MAX}` },
      { status: 400 },
    );
  }

  const result = await reviewSubmission({
    reviewerRole: session.role,
    submissionId,
    review: { action, feedback, geAward },
  });
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  return NextResponse.json({ submission: result.submission });
}
