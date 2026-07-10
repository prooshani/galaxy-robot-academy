"use client";

import Link from "next/link";
import { PageContainer, Panel, StatusChip } from "@galaxy/ui";
import { useUser } from "@/app/contexts/UserContext";

const destinations = [
  { href: "/student", icon: "◇", title: "Student cockpit", description: "Open missions, track progress, and send code transmissions." },
  { href: "/teacher", icon: "▦", title: "Mission Control", description: "Plan missions, review submissions, and award Galaxy Energy." },
  { href: "/badges", icon: "✦", title: "Badge Hall", description: "Explore Academy achievements and unlocked systems." },
  { href: "/role", icon: "◎", title: "Choose role", description: "Switch between Student Engineer and Mission Control." },
];

export default function Home() {
  const { user } = useUser();
  const primaryHref = user.role === "teacher" ? "/teacher" : user.role === "student" ? "/student" : "/role";
  const primaryLabel = user.role === "teacher" ? "Enter Mission Control" : user.role === "student" ? "Continue expedition" : "Choose your role";

  return (
    <main id="main-content" className="min-h-[calc(100vh-4.5rem)]">
      <PageContainer className="flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-12 sm:py-16">
        <section className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/12 via-panel/90 to-brand-secondary/15 px-5 py-10 text-center shadow-[var(--shadow-glow-cyan)] sm:px-10 sm:py-14" aria-labelledby="home-title">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-brand/40 bg-brand/10 font-mono font-black text-brand" aria-hidden="true">R0</div>
          <StatusChip tone="info" className="mt-5">Build · Think · Explore</StatusChip>
          <h1 id="home-title" className="mx-auto mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Galaxy Robot Academy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">Learn software engineering through a twelve-mission expedition. Build R0-B0 system by system, test ideas, and earn progress through real work.</p>
          <Link href={primaryHref} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-brand bg-brand px-6 font-bold text-canvas transition hover:brightness-110">{primaryLabel}<span className="ml-2" aria-hidden="true">→</span></Link>
          {user.role && <p className="mt-3 text-sm text-muted">Welcome back, {user.displayName}.</p>}
        </section>

        <section className="mt-8" aria-labelledby="destinations-title">
          <h2 id="destinations-title" className="font-display text-2xl font-semibold text-foreground">Choose destination</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {destinations.map((item) => <Link key={item.href} href={item.href} className="group rounded-2xl focus-visible:outline-none"><Panel className="h-full transition duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-secondary/50 motion-reduce:transform-none motion-reduce:transition-none"><span className="flex size-11 items-center justify-center rounded-xl border border-border bg-canvas/50 text-xl text-brand" aria-hidden="true">{item.icon}</span><h3 className="mt-4 font-display text-lg font-semibold text-foreground">{item.title}</h3><p className="mt-2 text-sm text-muted">{item.description}</p></Panel></Link>)}
          </div>
        </section>
        <footer className="mt-10 border-t border-border pt-5 text-center text-sm text-muted">Built for young engineers. Powered by curiosity and Galaxy Energy.</footer>
      </PageContainer>
    </main>
  );
}
