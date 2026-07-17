import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/firebase/session";
import { inviteTeacher } from "@/lib/firebase/admin-users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { email, displayName? }: invite a teacher. Returns a set-password link
// for the admin to share. Admin only.
export async function POST(req: NextRequest) {
  const admin = await getAdminSession({ strict: true });
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, displayName } = (await req.json().catch(() => ({}))) as {
    email?: string;
    displayName?: string;
  };
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  try {
    const result = await inviteTeacher(email, displayName ?? null);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invite failed" },
      { status: 500 },
    );
  }
}
