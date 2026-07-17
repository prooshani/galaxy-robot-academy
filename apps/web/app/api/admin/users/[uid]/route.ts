import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@galaxy/types";
import { getAdminSession } from "@/lib/firebase/session";
import {
  changeUserRole,
  setUserDisabled,
  passwordResetLink,
  setStudentGroup,
  deleteUserCompletely,
} from "@/lib/firebase/admin-users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: perform an admin action on a single user. Body: { action, ...payload }.
// Actions: setRole | setStatus | resetPassword | setGroup | delete.
export async function POST(req: NextRequest, ctx: { params: Promise<{ uid: string }> }) {
  const admin = await getAdminSession({ strict: true });
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { uid } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = body.action as string;

  // Guard against an admin locking themselves out.
  if (uid === admin.uid && (action === "delete" || action === "setStatus" || action === "setRole")) {
    return NextResponse.json({ error: "You cannot change your own admin account here." }, { status: 400 });
  }

  try {
    switch (action) {
      case "setRole": {
        const role = body.role as UserRole;
        if (!["student", "teacher", "admin"].includes(role)) {
          return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        await changeUserRole(uid, role);
        return NextResponse.json({ ok: true });
      }
      case "setStatus": {
        await setUserDisabled(uid, Boolean(body.disabled));
        return NextResponse.json({ ok: true });
      }
      case "resetPassword": {
        const email = body.email as string;
        if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
        const link = await passwordResetLink(email);
        return NextResponse.json({ ok: true, link });
      }
      case "setGroup": {
        await setStudentGroup(uid, (body.groupId as string) || null, (body.groupName as string) || null);
        return NextResponse.json({ ok: true });
      }
      case "delete": {
        await deleteUserCompletely(uid);
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Action failed" },
      { status: 500 },
    );
  }
}
