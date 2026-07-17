import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/firebase/session";
import { getProfile, updateOwnProfile } from "@/lib/firebase/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: the signed-in user's full profile.
export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const profile = await getProfile(session.uid, session.role);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(profile);
}

// PATCH: update owner-editable fields only (displayName, contact, personal,
// preferences). Server-controlled fields are silently dropped.
export async function PATCH(req: NextRequest) {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const patch = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const profile = await updateOwnProfile(session.uid, patch, session.role);
  return NextResponse.json(profile);
}
