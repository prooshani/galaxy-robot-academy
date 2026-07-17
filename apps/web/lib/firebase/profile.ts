import "server-only";
import { FieldValue, Timestamp, type DocumentReference, type DocumentSnapshot } from "firebase-admin/firestore";
import {
  DEFAULT_SUIT,
  OWNER_EDITABLE_BY_ROLE,
  ROLE_COLLECTIONS,
  USER_PROFILE_SCHEMA_VERSION,
  type AnyProfile,
  type UserRole,
} from "@galaxy/types";
import { adminDb } from "./admin";

const ALL_ROLES: UserRole[] = ["student", "teacher", "admin"];

function collectionForRole(role: UserRole) {
  return adminDb.collection(ROLE_COLLECTIONS[role]);
}

// ---- Default profiles (role-specific) ----------------------------------

function baseDefaults(input: { uid: string; email?: string | null; displayName?: string | null; role: UserRole }) {
  return {
    schemaVersion: USER_PROFILE_SCHEMA_VERSION,
    uid: input.uid,
    email: input.email ?? null,
    displayName: input.displayName ?? null,
    photoURL: null,
    avatarId: null,
    suit: DEFAULT_SUIT,
    role: input.role,
    status: "active",
    flags: { isActive: true, isVerified: false, emailVerified: false, onboardingComplete: false },
    contact: {
      phone: null,
      phoneVerified: false,
      address: { line1: null, line2: null, city: null, state: null, postalCode: null, country: null },
      timezone: null,
      locale: null,
    },
    personal: {
      firstName: null, lastName: null, dateOfBirth: null, bio: null,
      school: null, gradeLevel: null, guardianName: null, guardianEmail: null,
    },
    preferences: {
      notifications: { email: true, push: false, sms: false },
      theme: "system",
      language: "en",
      marketingOptIn: false,
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    lastLoginAt: FieldValue.serverTimestamp(),
  };
}

// The complete default doc for a given role.
export function buildDefaultProfile(input: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role: UserRole;
}): Record<string, unknown> {
  const base = baseDefaults(input);
  if (input.role === "teacher") {
    return {
      ...base,
      teaching: { title: null, bio: null, subjects: [], cohortIds: [], managedCourseIds: [], yearsExperience: null, verified: false },
    };
  }
  if (input.role === "admin") {
    return { ...base, admin: { accessLevel: "support", permissions: [] } };
  }
  // student
  return {
    ...base,
    gamification: { totalGE: 0, level: 1, rankId: "cadet", badgeIds: [], streakDays: 0, lastActivityAt: null },
    progress: { missionStatus: {}, missionTasksCompleted: {} },
    courses: [],
    subscription: {
      plan: "free", status: "none", startedAt: null, currentPeriodEnd: null,
      trialEndsAt: null, cancelAtPeriodEnd: false, provider: null, customerId: null, subscriptionId: null, seats: 1,
    },
    affiliate: { code: null, referredByCode: null, referredByUid: null, referralCount: 0 },
    group: { groupId: null, groupName: null },
  };
}

// ---- Locating a user across the three collections ----------------------

interface Located {
  role: UserRole;
  ref: DocumentReference;
  snap: DocumentSnapshot;
}

// Find which collection a uid lives in. Checks `roleHint` first (from the auth
// claim) for a single fast read, then the others. The collection a doc is
// found in IS the authoritative role.
export async function findUserDoc(uid: string, roleHint?: UserRole | null): Promise<Located | null> {
  const order = roleHint ? [roleHint, ...ALL_ROLES.filter((r) => r !== roleHint)] : ALL_ROLES;
  for (const role of order) {
    const ref = collectionForRole(role).doc(uid);
    const snap = await ref.get();
    if (snap.exists) return { role, ref, snap };
  }
  return null;
}

// ---- Mapping -----------------------------------------------------------

function iso(v: unknown): string | null {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === "string") return v;
  return null;
}

export function toProfile(uid: string, role: UserRole, data: Record<string, unknown>): AnyProfile {
  return {
    ...data,
    uid,
    role,
    createdAt: iso(data.createdAt) ?? new Date(0).toISOString(),
    updatedAt: iso(data.updatedAt) ?? new Date(0).toISOString(),
    lastLoginAt: iso(data.lastLoginAt),
  } as unknown as AnyProfile;
}

// ---- Provisioning ------------------------------------------------------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v) && (v as object).constructor === Object;
}
function backfill(defaults: Record<string, unknown>, target: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target };
  for (const [k, dv] of Object.entries(defaults)) {
    if (!(k in out) || out[k] === undefined) out[k] = dv;
    else if (isPlainObject(dv) && isPlainObject(out[k])) out[k] = backfill(dv, out[k] as Record<string, unknown>);
  }
  return out;
}

// Ensure a complete profile exists. New accounts land in "students"; existing
// docs (in whichever collection) are backfilled without clobbering values.
// Always stamps updatedAt + lastLoginAt. Returns the resolved role.
export async function provisionProfile(input: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
}): Promise<UserRole> {
  const found = await findUserDoc(input.uid);
  if (!found) {
    await collectionForRole("student").doc(input.uid).set(
      buildDefaultProfile({ ...input, role: "student" }),
    );
    return "student";
  }
  const defaults = buildDefaultProfile({ ...input, role: found.role });
  const merged = backfill(defaults, found.snap.data() ?? {});
  merged.updatedAt = FieldValue.serverTimestamp();
  merged.lastLoginAt = FieldValue.serverTimestamp();
  await found.ref.set(merged);
  return found.role;
}

// ---- Reads -------------------------------------------------------------

export async function getProfile(uid: string, roleHint?: UserRole | null): Promise<AnyProfile | null> {
  const found = await findUserDoc(uid, roleHint);
  if (!found) return null;
  return toProfile(uid, found.role, found.snap.data() ?? {});
}

export async function getProfileCore(
  uid: string,
  roleHint?: UserRole | null,
): Promise<{ role: UserRole; status: string | null; displayName: string | null; photoURL: string | null; avatarId: string | null } | null> {
  const found = await findUserDoc(uid, roleHint);
  if (!found) return null;
  const d = found.snap.data() ?? {};
  return {
    role: found.role,
    status: (d.status as string | undefined) ?? null,
    displayName: (d.displayName as string | undefined) ?? null,
    photoURL: (d.photoURL as string | undefined) ?? null,
    avatarId: (d.avatarId as string | undefined) ?? null,
  };
}

// ---- Writes ------------------------------------------------------------

// Apply an owner-initiated patch, keeping only fields editable for that role.
export async function updateOwnProfile(
  uid: string,
  patch: Record<string, unknown>,
  roleHint?: UserRole | null,
): Promise<AnyProfile | null> {
  const found = await findUserDoc(uid, roleHint);
  if (!found) return null;
  const allowed = new Set<string>(OWNER_EDITABLE_BY_ROLE[found.role]);
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (allowed.has(k)) safe[k] = v;
  }
  if (Object.keys(safe).length > 0) {
    safe.updatedAt = FieldValue.serverTimestamp();
    await found.ref.set(safe, { merge: true });
  }
  const fresh = await found.ref.get();
  return toProfile(uid, found.role, fresh.data() ?? {});
}

export async function setAvatarUrl(uid: string, photoURL: string, roleHint?: UserRole | null): Promise<void> {
  const found = await findUserDoc(uid, roleHint);
  if (!found) return;
  await found.ref.set({ photoURL, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function clearAvatarUrl(uid: string, roleHint?: UserRole | null): Promise<void> {
  const found = await findUserDoc(uid, roleHint);
  if (!found) return;
  await found.ref.set({ photoURL: null, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

// Sync gamification + mission progress — students only. No-op for other roles.
export async function updateProgress(
  uid: string,
  input: {
    gamification?: Partial<import("@galaxy/types").StudentProfile["gamification"]>;
    progress?: Partial<import("@galaxy/types").StudentProfile["progress"]>;
  },
  roleHint?: UserRole | null,
): Promise<void> {
  const found = await findUserDoc(uid, roleHint);
  if (!found || found.role !== "student") return;
  const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (input.gamification) {
    for (const [k, v] of Object.entries(input.gamification)) patch[`gamification.${k}`] = v;
    patch["gamification.lastActivityAt"] = FieldValue.serverTimestamp();
  }
  if (input.progress) {
    for (const [k, v] of Object.entries(input.progress)) patch[`progress.${k}`] = v;
  }
  await found.ref.update(patch);
}
