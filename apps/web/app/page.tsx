"use client";

import Link from "next/link";
import { useUser } from "@/app/contexts/UserContext";

export default function Home() {
  const { user } = useUser();

  const hasRole = user.role !== null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0e1a] px-4 py-12 text-gray-100">
      {/* Starry background effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.2), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Hero */}
        <div className="mb-8">
          <span className="mb-4 block text-6xl" aria-hidden="true">
            🚀
          </span>
          <h1 className="text-4xl font-bold text-cyan-400 sm:text-5xl lg:text-6xl">
            Galaxy Robot Academy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Teaching software engineering through space-themed missions.
            Complete challenges, earn Galaxy Energy, unlock badges, and watch
            R0-B0 evolve!
          </p>
        </div>

        {/* Role-aware greeting */}
        {hasRole ? (
          <div className="mb-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-4 shadow-lg shadow-cyan-950/20">
            <p className="text-lg font-semibold text-cyan-300">
              Welcome back, {user.displayName}!
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {user.role === "student"
                ? "Ready for your next mission?"
                : "Manage missions and review submissions."}
            </p>
            <Link
              href={user.role === "student" ? "/student" : "/teacher"}
              className="mt-3 inline-block rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-5 py-2 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label={
                user.role === "student"
                  ? "Go to Student Dashboard"
                  : "Go to Teacher Dashboard"
              }
            >
              {user.role === "student"
                ? "Go to Student Dashboard"
                : "Go to Teacher Dashboard"}
            </Link>
          </div>
        ) : (
          <div className="mb-10 rounded-lg border border-purple-500/30 bg-purple-500/10 px-6 py-4 shadow-lg shadow-purple-950/20">
            <p className="text-lg font-semibold text-purple-300">
              Choose your role to begin
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Are you here to learn or to teach?
            </p>
            <Link
              href="/role"
              className="mt-3 inline-block rounded-lg border border-purple-500/40 bg-purple-500/20 px-5 py-2 text-sm font-medium text-purple-200 transition-colors hover:border-purple-400 hover:bg-purple-500/30 hover:text-purple-100 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
              aria-label="Select a role"
            >
              Select a Role
            </Link>
          </div>
        )}

        {/* Navigation cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NavCard
            href="/student"
            icon="🚀"
            title="Student Dashboard"
            description="View missions, track progress, and submit code."
            accent="cyan"
          />
          <NavCard
            href="/teacher"
            icon="👩‍🏫"
            title="Teacher Dashboard"
            description="Create missions, review submissions, and award GE."
            accent="purple"
          />
          <NavCard
            href="/badges"
            icon="🏅"
            title="Badges"
            description="Browse all available badges and your collection."
            accent="cyan"
          />
          <NavCard
            href="/role"
            icon="🎭"
            title="Role Selection"
            description="Switch between student and teacher views."
            accent="purple"
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-sm text-gray-600">
          <p>
            Built for young engineers. Powered by curiosity and Galaxy Energy.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

interface NavCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  accent: "cyan" | "purple";
}

function NavCard({ href, icon, title, description, accent }: NavCardProps) {
  const borderClass =
    accent === "cyan"
      ? "border-cyan-500/30 hover:border-cyan-400/60"
      : "border-purple-500/30 hover:border-purple-400/60";
  const bgClass =
    accent === "cyan"
      ? "hover:bg-cyan-500/10"
      : "hover:bg-purple-500/10";
  const iconBgClass =
    accent === "cyan"
      ? "bg-cyan-400/10"
      : "bg-purple-400/10";

  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-3 rounded-lg border ${borderClass} ${bgClass} bg-[#111827] p-6 shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none`}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-lg text-3xl ${iconBgClass}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <h2 className="text-base font-semibold text-gray-100">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}
