"use client";

// The manual role picker is retired: roles are now determined by the account
// (students self-register, teachers are provisioned by the Academy). This route
// simply forwards to the right destination based on the signed-in session.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { canTeach } from "@galaxy/types";
import { useUser } from "@/app/contexts/UserContext";

export default function RoleRedirectPage() {
  const { user, authStatus } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "anon") {
      router.replace("/login");
      return;
    }
    router.replace(canTeach(user.role) ? "/teacher" : "/student");
  }, [authStatus, user.role, router]);

  return (
    <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4">
      <p className="text-muted" role="status">Routing to your station…</p>
    </main>
  );
}
