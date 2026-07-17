import { NextResponse, type NextRequest } from "next/server";
import { assessRecaptcha } from "@/lib/firebase/recaptcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ACTIONS = new Set(["LOGIN", "SIGNUP"]);

// Gate an auth attempt: verify the reCAPTCHA token before the client is allowed
// to sign in / create an account. Returns 403 on a bot-like signal.
export async function POST(req: NextRequest) {
  const { token, action } = (await req.json().catch(() => ({}))) as {
    token?: string;
    action?: string;
  };

  const expectedAction = action && ALLOWED_ACTIONS.has(action) ? action : "LOGIN";
  const result = await assessRecaptcha(token ?? "", expectedAction);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: result.reason }, // e.g. "low-score"
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true, score: result.score });
}
