import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/firebase/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns the signed-in user's identity + resolved role, or 401 if no session.
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  return NextResponse.json(user);
}
