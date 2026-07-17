"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { canTeach } from "@galaxy/types";
import { useUser } from "@/app/contexts/UserContext";

// Paths anyone can view without being signed in.
const PUBLIC_PATHS = ["/", "/login"];
// Paths that require the teacher role (teachers + admins).
const TEACHER_PREFIXES = ["/teacher"];
// Paths that require the admin role.
const ADMIN_PREFIXES = ["/admin"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

function isTeacherOnly(pathname: string): boolean {
  return TEACHER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAdminOnly(pathname: string): boolean {
  return ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, authStatus } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authStatus === "loading") return;

    // Not signed in -> send to login (except on public marketing pages).
    if (authStatus === "anon" && !isPublic(pathname)) {
      router.replace("/login");
      return;
    }

    // Signed in but a student on a teacher-only route -> bounce to their cockpit.
    if (authStatus === "authed" && !canTeach(user.role) && isTeacherOnly(pathname)) {
      router.replace("/student");
      return;
    }
    // Non-admins may not enter the admin console.
    if (authStatus === "authed" && user.role !== "admin" && isAdminOnly(pathname)) {
      router.replace(canTeach(user.role) ? "/teacher" : "/student");
    }
  }, [authStatus, user.role, pathname, router]);

  // While the session resolves, render a calm skeleton (avoids content flash).
  if (authStatus === "loading" && !isPublic(pathname)) {
    return (
      <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4" aria-busy="true">
        <div className="w-full max-w-xl animate-pulse rounded-2xl border border-border bg-panel/70 p-8 motion-reduce:animate-none">
          <span className="sr-only">Loading Academy systems</span>
          <div className="h-4 w-32 rounded bg-brand/20" />
          <div className="mt-4 h-10 w-3/4 rounded bg-white/10" />
          <div className="mt-4 h-5 w-full rounded bg-white/5" />
        </div>
      </main>
    );
  }

  if (isPublic(pathname)) {
    return <>{children}</>;
  }

  // Redirecting states: render a lightweight holding view instead of content.
  if (authStatus === "anon") {
    return <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4"><p className="text-muted" role="status">Opening Academy entry gate…</p></main>;
  }

  if (authStatus === "authed" && !canTeach(user.role) && isTeacherOnly(pathname)) {
    return <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4"><p className="text-muted" role="status">Rerouting to your cockpit…</p></main>;
  }
  if (authStatus === "authed" && user.role !== "admin" && isAdminOnly(pathname)) {
    return <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4"><p className="text-muted" role="status">Rerouting…</p></main>;
  }

  return <>{children}</>;
}
