"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { canTeach } from "@galaxy/types";
import dynamic from "next/dynamic";
import { useUser } from "@/app/contexts/UserContext";
import { Logo } from "@/components/Logo";

// Live 3D cadet avatar (WebGL, client-only) — matches the selected suit.
const SuitAvatar3D = dynamic(() => import("@/components/suit/SuitAvatar3D").then((m) => m.SuitAvatar3D), {
  ssr: false,
  loading: () => <span className="size-7 rounded-full bg-white/10" aria-hidden="true" />,
});

interface NavLink { href: string; label: string; icon: string; teacherOnly?: boolean; adminOnly?: boolean; }
const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/student", label: "Missions", icon: "◇" },
  { href: "/badges", label: "Badges", icon: "✦" },
  { href: "/teacher", label: "Teacher", icon: "▦", teacherOnly: true },
  { href: "/admin", label: "Admin", icon: "⚙", adminOnly: true },
];

function isActivePath(pathname: string, href: string) { return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); }

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, authStatus, signOut } = useUser();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const isAuthed = authStatus === "authed";
  // Signed-out visitors only see Home; teacher link is teacher-only.
  const visibleLinks = navLinks.filter((link) => {
    if (link.href === "/") return true;
    if (!isAuthed) return false;
    if (link.adminOnly) return user.role === "admin";
    if (link.teacherOnly) return canTeach(user.role);
    return true;
  });
  const roleLabel =
    user.role === "admin" ? "Admin console" : user.role === "teacher" ? "Teacher command" : "Student pilot";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="console-bar border-b border-white/10 bg-gradient-to-b from-command/95 via-command/80 to-command/55 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-18 items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center rounded-xl py-2" aria-label="Galaxy Robot Academy home">
            <Logo size="md" />
          </Link>

          <p className="stamp-label hidden items-center gap-2 text-[.58rem] text-muted 2xl:flex" aria-hidden="true">
            <span className="size-1.5 animate-pulse rounded-full bg-success motion-reduce:animate-none" />
            Orbit GX-A · Vel 7.6 km/s · Sys Nominal
          </p>

          <div className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map((link) => { const active = isActivePath(pathname, link.href); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`relative inline-flex min-h-11 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition ${active ? "border-brand/45 bg-brand/12 text-brand shadow-[0_0_14px_rgba(175,80,255,.25)]" : "border-transparent text-muted hover:border-white/15 hover:bg-white/5 hover:text-foreground"}`}><span aria-hidden="true">{link.icon}</span>{link.label}{active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand" />}</Link>; })}
          </div>

          <div className="flex items-center gap-2">
            {authStatus === "loading" ? (
              <span className="hidden h-10 w-28 animate-pulse rounded-full bg-white/10 sm:inline-flex motion-reduce:animate-none" aria-hidden="true" />
            ) : isAuthed ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/account" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-canvas/45 py-1 pl-1 pr-3 text-xs font-semibold text-muted transition hover:border-brand hover:text-foreground">
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="" className="size-7 rounded-full object-cover" />
                  ) : user.suit?.modelId ? (
                    <span className="size-7 overflow-hidden rounded-full bg-black/30">
                      <SuitAvatar3D modelId={user.suit.modelId} size={28} animate={false} />
                    </span>
                  ) : (
                    <span className="flex size-7 items-center justify-center rounded-full bg-brand/20 text-[.7rem] font-bold text-brand" aria-hidden="true">{(user.displayName || "?").charAt(0).toUpperCase()}</span>
                  )}
                  {roleLabel}
                </Link>
                <button type="button" onClick={handleSignOut} className="inline-flex min-h-10 items-center rounded-full border border-border px-3 text-xs font-semibold text-muted transition hover:border-brand-secondary hover:text-foreground">Sign out</button>
              </div>
            ) : (
              <Link href="/login" className="hidden min-h-10 items-center rounded-full border border-border bg-canvas/45 px-4 text-xs font-semibold text-foreground transition hover:border-brand sm:inline-flex">Sign in</Link>
            )}
            <button type="button" className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-elevated text-foreground lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}><span aria-hidden="true" className="text-xl">{open ? "×" : "≡"}</span></button>
          </div>
        </div>

        {open && <div id="mobile-navigation" className="grid gap-1 border-t border-border py-3 lg:hidden">{visibleLinks.map((link) => { const active = isActivePath(pathname, link.href); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${active ? "bg-brand/12 text-brand" : "text-muted hover:bg-white/5 hover:text-foreground"}`}><span aria-hidden="true">{link.icon}</span>{link.label}</Link>; })}{isAuthed ? <button type="button" onClick={handleSignOut} className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-muted hover:bg-white/5 hover:text-foreground"><span aria-hidden="true">⏻</span>Sign out ({roleLabel})</button> : <Link href="/login" className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-foreground"><span aria-hidden="true">◎</span>Sign in</Link>}</div>}
      </nav>
      </div>
      <div aria-hidden="true" className="console-edge mx-auto h-px max-w-5xl" />
    </header>
  );
}
