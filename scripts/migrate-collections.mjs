#!/usr/bin/env node
// One-shot migration: move every profile from the legacy single `users`
// collection into role-specific collections (students / teachers / admins),
// filling in that role's full schema. Preserves role + existing values, then
// deletes the old users/{uid} doc.
//
// Usage (repo root):
//   node --env-file=apps/web/.env.local scripts/migrate-collections.mjs
import { createRequire } from "node:module";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const databaseId = process.env.FIREBASE_DB_ID ?? "galaxy-robot-academy-db";
if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing admin credentials. Run with: node --env-file=apps/web/.env.local scripts/migrate-collections.mjs");
  process.exit(1);
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth(app);
const db = getFirestore(app, databaseId);

const COLLECTION = { student: "students", teacher: "teachers", admin: "admins" };

function base(uid, email, displayName, role) {
  return {
    schemaVersion: 1, uid, email: email ?? null, displayName: displayName ?? null,
    photoURL: null, avatarId: null, role, status: "active",
    flags: { isActive: true, isVerified: false, emailVerified: false, onboardingComplete: false },
    contact: { phone: null, phoneVerified: false, address: { line1: null, line2: null, city: null, state: null, postalCode: null, country: null }, timezone: null, locale: null },
    personal: { firstName: null, lastName: null, dateOfBirth: null, bio: null, school: null, gradeLevel: null, guardianName: null, guardianEmail: null },
    preferences: { notifications: { email: true, push: false, sms: false }, theme: "system", language: "en", marketingOptIn: false },
  };
}
function extras(role) {
  if (role === "teacher") return { teaching: { title: null, bio: null, subjects: [], cohortIds: [], managedCourseIds: [], yearsExperience: null, verified: false } };
  if (role === "admin") return { admin: { accessLevel: "support", permissions: [] } };
  return {
    gamification: { totalGE: 0, level: 1, rankId: "cadet", badgeIds: [], streakDays: 0, lastActivityAt: null },
    progress: { missionStatus: {}, missionTasksCompleted: {} },
    courses: [],
    subscription: { plan: "free", status: "none", startedAt: null, currentPeriodEnd: null, trialEndsAt: null, cancelAtPeriodEnd: false, provider: null, customerId: null, subscriptionId: null, seats: 1 },
    affiliate: { code: null, referredByCode: null, referredByUid: null, referralCount: 0 },
  };
}
const isPlain = (v) => typeof v === "object" && v !== null && !Array.isArray(v) && v.constructor === Object;
function backfill(def, cur) {
  const out = { ...cur };
  for (const [k, dv] of Object.entries(def)) {
    if (!(k in out) || out[k] === undefined) out[k] = dv;
    else if (isPlain(dv) && isPlain(out[k])) out[k] = backfill(dv, out[k]);
  }
  return out;
}

const run = async () => {
  let moved = 0;
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    for (const u of page.users) {
      const legacyRef = db.collection("users").doc(u.uid);
      const legacy = await legacyRef.get();
      const claimRole = u.customClaims?.role;
      const role = (legacy.exists ? legacy.get("role") : null) ?? claimRole ?? "student";
      const def = { ...base(u.uid, u.email ?? null, u.displayName ?? null, role), ...extras(role) };
      // Strip any foreign role-groups from legacy before merging.
      const legacyData = legacy.exists ? legacy.data() : {};
      const merged = backfill(def, legacyData);
      merged.role = role;
      merged.updatedAt = FieldValue.serverTimestamp();
      if (!merged.createdAt) merged.createdAt = FieldValue.serverTimestamp();
      // Drop role groups that don't belong to this role.
      const ROLE_GROUPS = { student: ["gamification", "progress", "courses", "subscription", "affiliate"], teacher: ["teaching"], admin: ["admin"] };
      for (const [r, keys] of Object.entries(ROLE_GROUPS)) {
        if (r !== role) for (const k of keys) delete merged[k];
      }

      await db.collection(COLLECTION[role]).doc(u.uid).set(merged, { merge: true });
      if (legacy.exists) await legacyRef.delete();
      moved++;
      console.log(`→ ${u.email ?? u.uid} → ${COLLECTION[role]} (role: ${role})`);
    }
    pageToken = page.pageToken;
  } while (pageToken);
  console.log(`\nDone. ${moved} profiles migrated into role collections.`);
};

run().then(() => process.exit(0), (err) => { console.error("Failed:", err.message); process.exit(1); });
