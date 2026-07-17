import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/firebase/session";
import { setAvatarUrl, clearAvatarUrl } from "@/lib/firebase/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "";

// Only accept Firebase Storage download URLs under this user's own avatar path,
// so a client can't point photoURL at an arbitrary external image.
function isOwnAvatarUrl(url: string, uid: string): boolean {
  try {
    const u = new URL(url);
    const isFirebaseHost =
      u.hostname === "firebasestorage.googleapis.com" ||
      u.hostname === "storage.googleapis.com";
    if (!isFirebaseHost) return false;
    if (BUCKET && !u.pathname.includes(BUCKET)) return false;
    // The object path is URL-encoded in the download URL (avatars%2F<uid>%2F…);
    // decoding covers both encoded and plain forms.
    return decodeURIComponent(u.pathname).includes(`avatars/${uid}/`);
  } catch {
    return false;
  }
}

// POST { url }: persist an avatar URL the client already uploaded to Storage.
export async function POST(req: NextRequest) {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url || !isOwnAvatarUrl(url, session.uid)) {
    return NextResponse.json({ error: "Invalid avatar URL" }, { status: 400 });
  }

  await setAvatarUrl(session.uid, url, session.role);
  return NextResponse.json({ ok: true, photoURL: url });
}

// DELETE: clear the uploaded photo (e.g. when switching to a space-suit preset).
export async function DELETE() {
  const session = await getSessionUser({ strict: true });
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  await clearAvatarUrl(session.uid, session.role);
  return NextResponse.json({ ok: true });
}
