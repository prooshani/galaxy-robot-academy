"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";

const PUBLIC_PATHS = ["/role"];

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user.role === null && !PUBLIC_PATHS.includes(pathname)) {
      router.push("/role");
    }
  }, [mounted, user.role, pathname, router]);

  // While mounting, render nothing to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // On public paths, always render
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // While role is null, render nothing (avoids flash of wrong content)
  if (user.role === null) {
    return null;
  }

  return <>{children}</>;
}
