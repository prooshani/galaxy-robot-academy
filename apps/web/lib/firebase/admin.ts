// Firebase Admin SDK — server ONLY. Never import from a client component.
// Uses the named Firestore database "galaxy-robot-academy-db".
import "server-only";
import {
  cert,
  getApps,
  getApp,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function loadCredentials() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Env stores the key with literal "\n"; restore real newlines.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars: FIREBASE_ADMIN_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY",
    );
  }
  return { projectId, clientEmail, privateKey };
}

// Named database created for this project (native mode, Zurich).
const DB_ID = process.env.FIREBASE_DB_ID ?? "galaxy-robot-academy-db";

// Reuse the admin app across serverless invocations / HMR reloads.
export const adminApp: App = getApps().length
  ? getApp()
  : initializeApp({ credential: cert(loadCredentials()) });

export const adminDb: Firestore = getFirestore(adminApp, DB_ID);
export const adminAuth: Auth = getAuth(adminApp);
