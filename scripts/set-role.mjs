#!/usr/bin/env node
// Set a user's role. Roles live in separate collections (students / teachers /
// admins), so a role change MOVES the profile doc between collections, adds the
// new role's fields, updates the `role` custom claim, and revokes tokens.
//
// Usage (repo root):
//   node --env-file=apps/web/.env.local scripts/set-role.mjs <email|uid> <student|teacher|admin>
import { createRequire } from "node:module";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const [target, role] = process.argv.slice(2);
const ROLES = ["student", "teacher", "admin"];
const COLLECTION = { student: "students", teacher: "teachers", admin: "admins" };
if (!target || !ROLES.includes(role)) {
  console.error("Usage: set-role.mjs <email|uid> <student|teacher|admin>");
  process.exit(1);
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const databaseId = process.env.FIREBASE_DB_ID ?? "galaxy-robot-academy-db";
if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing admin credentials. Run with: node --env-file=apps/web/.env.local scripts/set-role.mjs …");
  process.exit(1);
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth(app);
const db = getFirestore(app, databaseId);

// Role-specific default groups added when a doc enters that collection.
function roleExtras(r) {
  if (r === "teacher") return { teaching: { title: null, bio: null, subjects: [], cohortIds: [], managedCourseIds: [], yearsExperience: null, verified: false } };
  if (r === "admin") return { admin: { accessLevel: "support", permissions: [] } };
  return {
    gamification: { totalGE: 0, level: 1, rankId: "cadet", badgeIds: [], streakDays: 0, lastActivityAt: null },
    progress: { missionStatus: {}, missionTasksCompleted: {} },
    courses: [],
    subscription: { plan: "free", status: "none", startedAt: null, currentPeriodEnd: null, trialEndsAt: null, cancelAtPeriodEnd: false, provider: null, customerId: null, subscriptionId: null, seats: 1 },
    affiliate: { code: null, referredByCode: null, referredByUid: null, referralCount: 0 },
  };
}

// Role-specific group keys, so we can delete the ones that don't belong.
const ROLE_GROUPS = {
  student: ["gamification", "progress", "courses", "subscription", "affiliate"],
  teacher: ["teaching"],
  admin: ["admin"],
};
function foreignGroups(role) {
  return Object.entries(ROLE_GROUPS).filter(([r]) => r !== role).flatMap(([, keys]) => keys);
}

async function findDoc(uid) {
  for (const r of ROLES) {
    const ref = db.collection(COLLECTION[r]).doc(uid);
    const snap = await ref.get();
    if (snap.exists) return { role: r, ref, data: snap.data() };
  }
  return null;
}

const run = async () => {
  const record = target.includes("@") ? await auth.getUserByEmail(target) : await auth.getUser(target);
  const { uid } = record;

  const current = await findDoc(uid);
  const targetRef = db.collection(COLLECTION[role]).doc(uid);

  // Carry over shared data; add the new role's fields; drop the old role's extras.
  const carried = current?.data ?? {
    schemaVersion: 1, uid, email: record.email ?? null, displayName: record.displayName ?? null,
    photoURL: null, avatarId: null, status: "active",
    flags: { isActive: true, isVerified: false, emailVerified: record.emailVerified ?? false, onboardingComplete: false },
    contact: { phone: null, phoneVerified: false, address: { line1: null, line2: null, city: null, state: null, postalCode: null, country: null }, timezone: null, locale: null },
    personal: { firstName: null, lastName: null, dateOfBirth: null, bio: null, school: null, gradeLevel: null, guardianName: null, guardianEmail: null },
    preferences: { notifications: { email: true, push: false, sms: false }, theme: "system", language: "en", marketingOptIn: false },
    createdAt: FieldValue.serverTimestamp(),
  };

  // Strip role-specific groups from the carried data, then add the target's.
  const { gamification, progress, courses, subscription, affiliate, teaching, admin, ...shared } = carried;
  const next = { ...shared, ...roleExtras(role), role, uid, updatedAt: FieldValue.serverTimestamp() };
  if (!next.createdAt) next.createdAt = FieldValue.serverTimestamp();
  // Delete any role groups that don't belong to the target role.
  for (const key of foreignGroups(role)) next[key] = FieldValue.delete();

  await targetRef.set(next, { merge: true });
  if (current && current.role !== role) {
    await current.ref.delete();
    console.log(`↪ moved ${record.email ?? uid} from "${current.role}" to "${role}"`);
  }

  await auth.setCustomUserClaims(uid, { ...(record.customClaims ?? {}), role });
  await auth.revokeRefreshTokens(uid);
  console.log(`✔ ${record.email ?? uid} is now "${role}" (collection: ${COLLECTION[role]}). They must sign in again.`);
};

run().then(() => process.exit(0), (err) => { console.error("Failed:", err.message); process.exit(1); });
