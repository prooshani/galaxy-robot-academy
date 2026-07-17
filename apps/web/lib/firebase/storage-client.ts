"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "./client";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — mirrors the Storage rule.

// Upload an avatar image to Firebase Storage under avatars/{uid}/, then persist
// the resulting download URL to the user's profile via the API. Returns the URL.
export async function uploadAvatar(file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > MAX_BYTES) throw new Error("Image must be under 5 MB");

  // Stable object name (overwrites the previous avatar).
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const objectRef = ref(storage, `avatars/${user.uid}/avatar.${ext}`);
  await uploadBytes(objectRef, file, { contentType: file.type });
  const url = await getDownloadURL(objectRef);

  const res = await fetch("/api/user/avatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to save avatar");
  return url;
}
