import "server-only";
import type { UserRole } from "@galaxy/types";
import { adminAuth } from "./admin";
import { provisionProfile, getProfileCore } from "./profile";

export type Role = UserRole;

export interface UserRecord {
  uid: string;
  role: Role;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  avatarId: string | null;
}

// Ensure a complete profile doc (in the role's collection) + a matching `role`
// custom claim exist. New accounts default to "student"; teacher/admin are
// granted out-of-band (see scripts/set-role.mjs). Returns the resolved role.
export async function provisionUser(input: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
}): Promise<Role> {
  const role = await provisionProfile(input);

  // Mirror the collection-derived role onto the token as a custom claim
  // (Firestore rules read the claim; the collection stays the source of truth).
  const authUser = await adminAuth.getUser(input.uid);
  if (authUser.customClaims?.role !== role) {
    await adminAuth.setCustomUserClaims(input.uid, { ...authUser.customClaims, role });
  }
  return role;
}

// The durable role (which collection the doc lives in), or null if not found.
export async function getUserRole(uid: string, roleHint?: Role | null): Promise<Role | null> {
  const core = await getProfileCore(uid, roleHint);
  return core?.role ?? null;
}
