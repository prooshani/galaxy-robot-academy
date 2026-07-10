"use client";

import { Layout } from "@galaxy/ui";
import { useUser } from "@/app/contexts/UserContext";
import { canonicalBadges as badges } from "@/lib/academyContent";

export default function BadgesPage() {
  const { user } = useUser();

  return (
    <Layout title="Badge Collection">
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Unlocked" value={String(user.badgeIds.length)} />
        <StatCard
          label="Available"
          value={String(Math.max(badges.length - user.badgeIds.length, 0))}
        />
        <StatCard label="Total Badges" value={String(badges.length)} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-200">
          All Badges
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {badges.map((badge) => {
            const unlocked = user.badgeIds.includes(badge.badgeId);

            return (
              <article
                key={badge.badgeId}
                className={`rounded-lg border bg-[#111827] p-4 shadow-md transition-colors ${
                  unlocked
                    ? "border-cyan-500/40 shadow-cyan-950/20"
                    : "border-purple-500/20 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border text-2xl ${
                        unlocked
                          ? "border-cyan-400/40 bg-cyan-400/10"
                          : "border-gray-700 bg-gray-900/60 grayscale"
                      }`}
                      aria-hidden="true"
                    >
                      {badge.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-gray-100">
                        {badge.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
                      unlocked
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                        : "border-gray-600 bg-gray-800 text-gray-400"
                    }`}
                  >
                    {unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-purple-500/30 bg-[#111827] p-4 shadow-md">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-cyan-400">{value}</p>
    </div>
  );
}
