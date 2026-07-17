"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { canTeach } from "@galaxy/types";
import { useUser } from "@/app/contexts/UserContext";
import dynamic from "next/dynamic";
import { CockpitFrame } from "@/components/space/CockpitFrame";
import { SpaceTravel } from "@/components/space/SpaceTravel";

// Real 3D planets/rocket backdrop — WebGL, client-only.
const PlanetScene3D = dynamic(() => import("@/components/space/PlanetScene3D").then((m) => m.PlanetScene3D), {
  ssr: false,
});

function ConsoleScreen({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`console-screen ${className ?? ""}`}>
      <span className="console-tag" aria-hidden="true">{label}</span>
      <span className="console-notch notch-tl" aria-hidden="true" /><span className="console-notch notch-tr" aria-hidden="true" />
      <span className="console-notch notch-bl" aria-hidden="true" /><span className="console-notch notch-br" aria-hidden="true" />
      {children}
    </div>
  );
}

const destinations = [
  { href: "/student", number: "01", icon: "🚀", title: "Student cockpit", description: "Fly your missions." },
  { href: "/teacher", number: "02", icon: "🛰️", title: "Mission Control", description: "Guide the crew." },
  { href: "/badges", number: "03", icon: "🏅", title: "Badge Hall", description: "Collect your wins." },
  { href: "/login", number: "04", icon: "🌌", title: "Entry Gate", description: "Sign in to launch." },
];

const systems = [
  { icon: "🗣️", label: "Speaking" }, { icon: "🧠", label: "Remembering" }, { icon: "❓", label: "Asking questions" },
  { icon: "🎯", label: "Making decisions" }, { icon: "🔁", label: "Repeating work" }, { icon: "🧭", label: "Navigating" },
  { icon: "🎒", label: "Managing inventory" }, { icon: "🧩", label: "Reusable skills" }, { icon: "🪐", label: "Exploring planets" },
  { icon: "☄️", label: "Surviving events" }, { icon: "🚀", label: "Launch prep" }, { icon: "🏁", label: "Final mission" },
];

export default function Home() {
  const { user, authStatus } = useUser();
  const isAuthed = authStatus === "authed";
  const isTeacher = canTeach(user.role);
  const passRef = useRef<HTMLElement>(null);
  const primaryHref = !isAuthed ? "/login" : isTeacher ? "/teacher" : "/student";
  const primaryLabel = !isAuthed ? "Begin as Student Engineer" : isTeacher ? "Enter Mission Control" : "Continue expedition";

  // The boarding pass drifts toward the cursor like a weightless card being nudged
  const tiltPass = (event: React.MouseEvent<HTMLElement>) => {
    const pass = passRef.current;
    if (!pass || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = pass.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
    pass.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(2deg)`;
  };
  const releasePass = () => { if (passRef.current) passRef.current.style.transform = ""; };

  return (
    <main id="main-content" className="relative">
      {/* Fixed layers: starfield, real 3D planets, hull frame — none of it scrolls */}
      <SpaceTravel />
      <PlanetScene3D />
      <CockpitFrame />

      {/* ——— Hero: floating in the launch window ——— */}
      <section className="relative" aria-labelledby="home-title">
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-14 lg:px-8 lg:pt-28 lg:pb-36">
          <div className="float-1">
            <p className="stamp-label text-xs text-halo">Junior Space Engineer Program</p>
            <h1 id="home-title" className="holo-title mt-6 text-foreground">
              <span className="display-serif block text-4xl text-halo sm:text-5xl">Become a</span>
              <span className="mt-2 block font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">Space Software<br />Engineer</span>
              <span className="display-serif mt-2 block text-4xl text-halo sm:text-5xl">with R0-B0.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-secondary sm:text-lg">Twelve missions. One robot. Your code wakes R0-B0 up — system by system.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href={primaryHref} className="zerog inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 font-bold text-canvas shadow-[var(--shadow-glow-violet)] hover:brightness-110">{primaryLabel}<span className="ml-2" aria-hidden="true">→</span></Link>
              <Link href="/student" className="group inline-flex min-h-12 items-center gap-3 font-semibold text-foreground">
                <span className="zerog flex size-10 items-center justify-center rounded-full border border-[var(--hairline-strong)] bg-white/5 text-sm group-hover:border-halo group-hover:bg-white/10" aria-hidden="true">▶</span>
                See the 12 missions
              </Link>
            </div>
            {user.role && <p className="mt-5 text-sm text-muted">Welcome back, {user.displayName}. Systems are warm.</p>}
          </div>

          <div aria-hidden="true" className="blink-slow pointer-events-none absolute -bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
            <span className="stamp-label text-[.6rem] text-halo/80">▼ Scroll to Flight Deck</span>
          </div>

          {/* Cadet boarding pass — untethered, drifting, nudged by the cursor */}
          <div className="float-2">
            <aside ref={passRef} onMouseMove={tiltPass} onMouseLeave={releasePass} className="relative rotate-2 rounded-[var(--radius-cards)] border border-[var(--hairline-strong)] bg-white/[.06] p-6 backdrop-blur-md transition-transform duration-300 ease-out sm:p-8" aria-label="Cadet boarding pass">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="stamp-label text-[.65rem] text-halo">⬡ Boarding Pass</p>
                  <div className="mt-4 flex items-center gap-3 font-mono text-sm text-foreground">
                    <span><span className="block text-[.6rem] uppercase tracking-widest text-muted">Origin</span>EARTH</span>
                    <span aria-hidden="true" className="text-halo">→</span>
                    <span><span className="block text-[.6rem] uppercase tracking-widest text-muted">Destination</span>GX-A</span>
                  </div>
                </div>
                <div className="barcode-v h-24 w-10 shrink-0 rounded-sm opacity-80" aria-hidden="true" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Your seat on the next launch</h2>
              <p className="mt-2 text-sm leading-6 text-secondary">Passenger: Junior Engineer · Fuel: Galaxy Energy.</p>
              <div className="mt-6 grid gap-3">
                <Link href={isAuthed && user.role === "student" ? "/student" : "/login"} className="zerog inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-canvas hover:brightness-110">Start as Student Engineer</Link>
                <Link href={isAuthed && isTeacher ? "/teacher" : "/login"} className="zerog inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--hairline-strong)] bg-white/5 px-6 text-sm font-semibold text-foreground hover:border-halo hover:bg-white/10">Enter Mission Control</Link>
              </div>
              <div className="barcode mt-6 h-8 rounded-sm opacity-70" aria-hidden="true" />
            </aside>
          </div>
        </div>

        {/* Stats stamp band — floating strip, not a wall */}
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <dl className="float-3 grid grid-cols-1 gap-y-3 rounded-full border border-[var(--hairline-soft)] bg-canvas/50 px-8 py-5 text-center backdrop-blur-md sm:grid-cols-3">
            <div><dt className="sr-only">Missions</dt><dd className="stamp-label text-sm text-foreground">🛰 12 Missions</dd></div>
            <div><dt className="sr-only">Robot</dt><dd className="stamp-label text-sm text-foreground">🤖 1 Space Robot</dd></div>
            <div><dt className="sr-only">Curiosity</dt><dd className="stamp-label text-sm text-foreground">✨ ∞ Curiosity</dd></div>
          </dl>
        </div>
      </section>

      {/* ——— Destinations: waypoints on the flight route ——— */}
      <section className="depth-in relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="destinations-title">
        <ConsoleScreen label="NAV · Flight Deck" className="p-6 pt-10 sm:p-10">
        <h2 id="destinations-title" className="stamp-label text-center text-xl text-foreground sm:text-2xl lg:text-3xl">Choose Destination</h2>
        <div className="relative mt-10">
          <div aria-hidden="true" className="route-line absolute inset-x-0 top-6 hidden h-px xl:block" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {destinations.map((item, index) => (
              <Link key={item.href} href={item.href} className={`group relative rounded-[var(--radius-cards)] focus-visible:outline-none float-${(index % 4) + 1}`}>
                <span aria-hidden="true" className="absolute left-1/2 top-6 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-halo bg-canvas transition group-hover:bg-halo xl:block" />
                <article className="relative mt-0 h-full overflow-hidden rounded-[var(--radius-cards)] border border-[var(--hairline-soft)] bg-panel/85 p-6 pt-9 transition duration-200 group-hover:-translate-y-1.5 group-hover:border-halo/60 group-hover:shadow-[var(--shadow-glow-violet)] group-active:translate-y-1 group-active:scale-[.98] motion-reduce:transform-none xl:mt-12">
                  <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-4 font-display text-8xl font-bold text-white/[.05]">{item.number}</span>
                  <span className="inline-block text-4xl transition duration-200 group-hover:-translate-y-1 group-hover:scale-110 motion-reduce:transform-none" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-halo">Open<span aria-hidden="true" className="transition group-hover:translate-x-1 motion-reduce:transform-none">→</span></span>
                </article>
              </Link>
            ))}
          </div>
        </div>
        </ConsoleScreen>
      </section>

      {/* ——— R0-B0 systems: power-ups floating in formation ——— */}
      <section className="depth-in relative mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8" aria-labelledby="systems-title">
        <ConsoleScreen label="DIAG · R0-B0 Systems" className="px-2 sm:px-4">
        <div className="grid gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-8">
          <div className="float-1">
            <p className="stamp-label text-xs text-halo">Systems Online</p>
            <h2 id="systems-title" className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Every mission unlocks a new power</h2>
            <p className="mt-4 max-w-md leading-7 text-secondary">R0-B0 launches knowing nothing. Every mission you code installs a new system.</p>
            <div className="mt-10 flex justify-center lg:justify-start">
              <div className="robot-bob">
                <Image src="/brand/logo-badge.png" alt="R0-B0, the Academy robot" width={210} height={128} className="drop-shadow-[0_0_32px_rgba(175,80,255,.45)]" />
              </div>
            </div>
          </div>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {systems.map((system, index) => (
              <li key={system.label} className={`rounded-2xl border border-[var(--hairline-soft)] bg-panel/85 p-4 transition hover:-translate-y-1 hover:border-halo/50 motion-reduce:transform-none`}>
                <span className="flex items-baseline justify-between"><span className="text-xl" aria-hidden="true">{system.icon}</span><span className="stamp-label text-[.6rem] text-muted">{String(index + 1).padStart(2, "0")}</span></span>
                <span className="mt-2 block text-sm font-semibold text-foreground">{system.label}</span>
              </li>
            ))}
          </ol>
        </div>
        </ConsoleScreen>
      </section>

      {/* ——— Transmission CTA: the comms screen ——— */}
      <section className="depth-in relative mx-auto max-w-7xl px-4 py-20 pb-24 sm:px-6 lg:px-8" aria-labelledby="cta-title">
        <div className="float-2">
          <ConsoleScreen label="COMMS · Incoming" className="p-8 text-center shadow-[var(--shadow-glow-violet)] sm:p-12">
            <p className="stamp-label text-xs text-halo"><span className="blink-slow mr-2 inline-block size-1.5 rounded-full bg-danger align-middle" aria-hidden="true" />Incoming Transmission</p>
            <p className="display-serif mx-auto mt-4 max-w-2xl text-3xl text-foreground sm:text-4xl">“I’m ready when you are, engineer.”</p>
            <p className="mt-3 text-sm text-muted">— R0-B0, waiting on the launch pad</p>
            <Link href={primaryHref} className="zerog mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 font-bold text-canvas hover:brightness-110">{primaryLabel}<span className="ml-2" aria-hidden="true">→</span></Link>
          </ConsoleScreen>
        </div>
      </section>
    </main>
  );
}
