import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// Admin SDK requires the Node.js runtime (not edge) and must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight connectivity check against the named Firestore database.
export async function GET() {
  try {
    const collections = await adminDb.listCollections();
    return NextResponse.json({
      ok: true,
      database: process.env.FIREBASE_DB_ID ?? "galaxy-robot-academy-db",
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      collections: collections.map((c) => c.id),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
