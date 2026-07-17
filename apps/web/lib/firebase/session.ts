import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./admin";
import { type Role, type UserRecord } from "./users";
import { getProfileCore } from "./profile";
import type { DecodedIdToken } from "firebase-admin/auth";

const SESSION_COOKIE = "__session";

// Resolve the signed-in user from the session cookie. Returns null when there
// is no valid session. Call from server components, route handlers, or actions.
// `checkRevoked` forces a lookup against Firebase (slower, but catches sign-out
// on other devices) — leave false for cheap per-request reads.
export async function getCurrentUser(
  checkRevoked = false,
): Promise<DecodedIdToken | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    return await adminAuth.verifySessionCookie(cookie, checkRevoked);
  } catch {
    return null;
  }
}

// Full session identity + role. The Firestore doc is the source of truth
// (written synchronously on provisioning + promotion); the token claim is only
// a fallback, since a stale session cookie can carry an outdated role.
//
// Pass `{ strict: true }` from every state-changing (non-GET) route handler:
// it re-checks the session against Firebase (catches revoked sessions from
// sign-out elsewhere / account disable) and rejects suspended accounts.
// Cheap verification stays the default for read-only routes.
export async function getSessionUser(
  options?: { strict?: boolean },
): Promise<UserRecord | null> {
  const decoded = await getCurrentUser(options?.strict === true);
  if (!decoded) return null;
  // Use the claim as a collection hint; the collection the doc is found in is
  // authoritative (handles a stale claim after a role change).
  const core = await getProfileCore(decoded.uid, decoded.role as Role | undefined);
  if (options?.strict === true && core?.status === "suspended") return null;
  const role: Role = core?.role ?? (decoded.role as Role | undefined) ?? "student";
  return {
    uid: decoded.uid,
    role,
    email: decoded.email ?? null,
    displayName: core?.displayName ?? (decoded.name as string | undefined) ?? null,
    photoURL: core?.photoURL ?? null,
    avatarId: core?.avatarId ?? null,
  };
}

// Returns the session only if the caller is an admin, else null. Gates the
// /api/admin/* routes.
export async function getAdminSession(
  options?: { strict?: boolean },
): Promise<UserRecord | null> {
  const session = await getSessionUser(options);
  return session && session.role === "admin" ? session : null;
}
