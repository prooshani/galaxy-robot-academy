import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/firebase/session";
import { listAllUsers } from "@/lib/firebase/admin-users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: list all users across roles. Admin only.
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await listAllUsers();
  return NextResponse.json({ users });
}
