"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/app/contexts/UserContext";

interface NavLink { href: string; label: string; icon: string; }
const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/student", label: "Missions", icon: "◇" },
  { href: "/badges", label: "Badges", icon: "✦" },
  { href: "/teacher", label: "Teacher", icon: "▦" },
];

function isActivePath(pathname: string, href: string) { return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); }

export function NavBar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const visibleLinks = navLinks.filter((link) => link.href !== "/teacher" || user.role === "teacher");
  const roleLabel = user.role === "teacher" ? "Teacher command" : user.role === "student" ? "Student pilot" : "Choose role";

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-command/85 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-18 items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3 rounded-xl py-2" aria-label="Galaxy Robot Academy home">
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand/35 bg-brand/10 text-brand shadow-[var(--shadow-glow-cyan)]" aria-hidden="true">
              <span className="absolute top-1.5 h-1.5 w-3 rounded-full bg-brand" />
              <span className="mt-1 font-mono text-xs font-black">R0</span>
            </span>
            <span className="min-w-0"><span className="block truncate font-display text-sm font-bold tracking-tight text-foreground sm:text-base">Galaxy Robot Academy</span><span className="block text-[.65rem] font-bold uppercase tracking-[.16em] text-brand">Mission control</span></span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map((link) => { const active = isActivePath(pathname, link.href); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`relative inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition ${active ? "bg-brand/12 text-brand" : "text-muted hover:bg-white/5 hover:text-foreground"}`}><span aria-hidden="true">{link.icon}</span>{link.label}{active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand" />}</Link>; })}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/role" className="hidden min-h-10 items-center gap-2 rounded-full border border-border bg-canvas/45 px-3 text-xs font-semibold text-muted transition hover:border-brand-secondary hover:text-foreground sm:inline-flex"><span className={`size-2 rounded-full ${user.role ? "bg-success" : "bg-warning"}`} aria-hidden="true" />{roleLabel}</Link>
            <button type="button" className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-elevated text-foreground lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}><span aria-hidden="true" className="text-xl">{open ? "×" : "≡"}</span></button>
          </div>
        </div>

        {open && <div id="mobile-navigation" className="grid gap-1 border-t border-border py-3 lg:hidden">{visibleLinks.map((link) => { const active = isActivePath(pathname, link.href); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${active ? "bg-brand/12 text-brand" : "text-muted hover:bg-white/5 hover:text-foreground"}`}><span aria-hidden="true">{link.icon}</span>{link.label}</Link>; })}<Link href="/role" className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-foreground"><span aria-hidden="true">◎</span>{roleLabel}</Link></div>}
      </nav>
    </header>
  );
}
