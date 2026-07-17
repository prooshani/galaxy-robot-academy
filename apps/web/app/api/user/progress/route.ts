import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/firebase/session";
import { updateProgress } from "@/lib/firebase/profile";
import type { StudentProfile } from "@galaxy/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH: sync the signed-in user's mission progress to Firestore.
// Writes only the caller's own doc (uid from the verified session).
// Gamification (GE/badges/rank) and quiz progress are server-authoritative —
// written only by quiz attempts and teacher reviews — so any client-sent
// values for them are ignored here.
export async function PATCH(req: NextRequest) {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    progress?: Partial<StudentProfile["progress"]>;
  } | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await updateProgress(
    session.uid,
    {
      progress: {
        ...(body.progress?.missionStatus ? { missionStatus: body.progress.missionStatus } : {}),
        ...(body.progress?.missionTasksCompleted
          ? { missionTasksCompleted: body.progress.missionTasksCompleted }
          : {}),
      },
    },
    session.role,
  );
  return NextResponse.json({ ok: true });
}
