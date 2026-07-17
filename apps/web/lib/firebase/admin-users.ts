import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { ROLE_COLLECTIONS, type UserRole } from "@galaxy/types";
import { adminAuth, adminDb } from "./admin";
import { buildDefaultProfile, findUserDoc } from "./profile";

// Base fields carried over unchanged when a profile moves between collections.
const SHARED_KEYS = [
  "schemaVersion", "email", "displayName", "photoURL", "avatarId",
  "status", "flags", "contact", "personal", "preferences", "createdAt",
];

export interface AdminUserRow {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  status: string;
  groupName: string | null;
  disabled: boolean;
  emailVerified: boolean;
  lastSignInAt: string | null;
  createdAt: string | null;
}

// List every user across the three role collections, enriched with auth state.
export async function listAllUsers(): Promise<AdminUserRow[]> {
  // Auth metadata (disabled / verified / last sign-in) keyed by uid.
  const authMap = new Map<string, { disabled: boolean; emailVerified: boolean; lastSignInAt: string | null }>();
  let pageToken: string | undefined;
  do {
    const page = await adminAuth.listUsers(1000, pageToken);
    for (const u of page.users) {
      authMap.set(u.uid, {
        disabled: u.disabled,
        emailVerified: u.emailVerified,
        lastSignInAt: u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime).toISOString() : null,
      });
    }
    pageToken = page.pageToken;
  } while (pageToken);

  const rows: AdminUserRow[] = [];
  for (const role of Object.keys(ROLE_COLLECTIONS) as UserRole[]) {
    const snap = await adminDb.collection(ROLE_COLLECTIONS[role]).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const auth = authMap.get(doc.id);
      rows.push({
        uid: doc.id,
        email: (d.email as string | undefined) ?? null,
        displayName: (d.displayName as string | undefined) ?? null,
        role,
        status: (d.status as string | undefined) ?? "active",
        groupName: (d.group?.groupName as string | undefined) ?? null,
        disabled: auth?.disabled ?? false,
        emailVerified: auth?.emailVerified ?? false,
        lastSignInAt: auth?.lastSignInAt ?? null,
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : null,
      });
    }
  }
  rows.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
  return rows;
}

// Move a user's profile into the target role's collection, refresh the claim,
// and revoke tokens so the change takes effect on next sign-in.
export async function changeUserRole(uid: string, role: UserRole): Promise<void> {
  const found = await findUserDoc(uid);
  const authUser = await adminAuth.getUser(uid);
  const defaults = buildDefaultProfile({
    uid,
    email: authUser.email ?? null,
    displayName: authUser.displayName ?? null,
    role,
  });

  // Carry shared base fields from the existing doc (if any) over the defaults.
  const existing = found?.snap.data() ?? {};
  const shared: Record<string, unknown> = {};
  for (const k of SHARED_KEYS) if (existing[k] !== undefined) shared[k] = existing[k];

  const next = { ...defaults, ...shared, role, uid, updatedAt: FieldValue.serverTimestamp() };
  await adminDb.collection(ROLE_COLLECTIONS[role]).doc(uid).set(next);

  if (found && found.role !== role) await found.ref.delete();

  if (authUser.customClaims?.role !== role) {
    await adminAuth.setCustomUserClaims(uid, { ...authUser.customClaims, role });
    await adminAuth.revokeRefreshTokens(uid);
  }
}

// Enable/disable an account (blocks sign-in) and mirror to the profile.
export async function setUserDisabled(uid: string, disabled: boolean): Promise<void> {
  await adminAuth.updateUser(uid, { disabled });
  const found = await findUserDoc(uid);
  if (found) {
    await found.ref.set(
      { status: disabled ? "suspended" : "active", "flags.isActive": !disabled, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  }
  if (disabled) await adminAuth.revokeRefreshTokens(uid);
}

// Generate a password-reset link for the admin to share (no email is sent here).
export async function passwordResetLink(email: string): Promise<string> {
  return adminAuth.generatePasswordResetLink(email);
}

// Assign a student to a class/group.
export async function setStudentGroup(uid: string, groupId: string | null, groupName: string | null): Promise<void> {
  const found = await findUserDoc(uid);
  if (!found || found.role !== "student") throw new Error("Not a student");
  await found.ref.set({ group: { groupId, groupName }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

// Invite a teacher: create the account (if new), provision the teacher profile,
// set the claim, and return a link they use to set their password.
export async function inviteTeacher(
  email: string,
  displayName: string | null,
): Promise<{ uid: string; setupLink: string }> {
  let user;
  try {
    user = await adminAuth.getUserByEmail(email);
  } catch {
    user = await adminAuth.createUser({ email, displayName: displayName ?? undefined, emailVerified: false });
  }
  await changeUserRole(user.uid, "teacher");
  const setupLink = await adminAuth.generatePasswordResetLink(email);
  return { uid: user.uid, setupLink };
}

// Permanently remove an account and its profile doc.
export async function deleteUserCompletely(uid: string): Promise<void> {
  const found = await findUserDoc(uid);
  if (found) await found.ref.delete();
  await adminAuth.deleteUser(uid);
}
