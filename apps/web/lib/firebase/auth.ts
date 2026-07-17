"use client";

// Client-side auth helpers. Sign the user in with Firebase, then exchange the
// resulting ID token for an httpOnly session cookie (see /api/auth/session)
// so server components / route handlers can trust the request.
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./client";

export type Role = "student" | "teacher" | "admin";

// Firebase Hosting only forwards a cookie literally named "__session".
// Exchanges the ID token for the session cookie and returns the resolved role.
async function startSession(user: FirebaseUser): Promise<Role> {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Failed to establish server session");
  const data = (await res.json()) as { role?: Role };
  return data.role ?? "student";
}

export async function signInWithEmail(email: string, password: string): Promise<Role> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return startSession(user);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<Role> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(user, { displayName });
  return startSession(user);
}

export async function signInWithGoogle(): Promise<Role> {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  return startSession(user);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
  await fetch("/api/auth/session", { method: "DELETE" });
}
