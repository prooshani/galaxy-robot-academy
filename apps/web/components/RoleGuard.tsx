"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";

const PUBLIC_PATHS = ["/role", "/"];

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
    return <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4" aria-busy="true"><div className="w-full max-w-xl animate-pulse rounded-2xl border border-border bg-panel/70 p-8 motion-reduce:animate-none"><span className="sr-only">Loading Academy systems</span><div className="h-4 w-32 rounded bg-brand/20" /><div className="mt-4 h-10 w-3/4 rounded bg-white/10" /><div className="mt-4 h-5 w-full rounded bg-white/5" /></div></main>;
  }

  // On public paths, always render
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // While role is null, render nothing (avoids flash of wrong content)
  if (user.role === null) {
    return <main id="main-content" className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4"><p className="text-muted" role="status">Opening Academy entry gate…</p></main>;
  }

  return <>{children}</>;
}
