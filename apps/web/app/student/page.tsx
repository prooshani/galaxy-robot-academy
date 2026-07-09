"use client";

import Link from "next/link";
import { Layout } from "@galaxy/ui";
import { badges } from "@/lib/sampleData";
import { getRankName } from "@galaxy/config";
import { useUser } from "@/app/contexts/UserContext";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import type { MissionStatus } from "@galaxy/types";

export default function StudentDashboard() {
  const { user } = useUser();
  const { missions } = useMissionsContext();
  const earnedBadges = badges.filter((b) =>
    user.badgeIds.includes(b.badgeId)
  );

  const statusColors: Record<MissionStatus, string> = {
    notStarted: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    submitted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    reviewed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <Layout title="Student Dashboard">
      {/* Hero stats */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Galaxy Energy" value={`${user.totalGE} GE`} accent="cyan" />
        <StatCard
          label="Current Rank"
          value={getRankName(user.rankId)}
          accent="purple"
        />
        <StatCard
          label="Badges Earned"
          value={`${earnedBadges.length} / ${badges.length}`}
          accent="cyan"
        />
      </section>

      {/* Earned Badges Detail */}
      {earnedBadges.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-200">
            Earned Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((badge) => (
              <div
                key={badge.badgeId}
                className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-[#111827] px-3 py-2 shadow-md"
              >
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-100">
                    {badge.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Missions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-200">
          All Missions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {missions.map((mission) => (
            <MissionCard
              key={mission.missionId}
              mission={mission}
              missionStatus={user.missionStatus[mission.missionId] ?? "notStarted"}
              statusColors={statusColors}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string;
  accent: "cyan" | "purple";
}

function StatCard({ label, value, accent }: StatCardProps) {
  const accentClass =
    accent === "cyan" ? "text-cyan-400" : "text-purple-400";
  const borderClass =
    accent === "cyan"
      ? "border-cyan-500/30"
      : "border-purple-500/30";

  return (
    <div
      className={`rounded-lg border ${borderClass} bg-[#111827] p-4 shadow-md`}
    >
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}

interface MissionCardProps {
  mission: {
    missionId: string;
    sessionNumber: number;
    title: string;
    story: string;
    rewardGE: number;
    badgeIds: string[];
  };
  missionStatus: MissionStatus;
  statusColors: Record<MissionStatus, string>;
}

function MissionCard({ mission, missionStatus, statusColors }: MissionCardProps) {
  return (
    <Link
      href={`/mission/${mission.missionId}`}
      className="block rounded-lg border border-purple-500/30 bg-[#111827] p-4 shadow-md transition-colors hover:border-purple-500/60"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded bg-purple-900/50 px-2 py-0.5 text-xs text-purple-300">
          Session {mission.sessionNumber}
        </span>
        <span className="text-sm font-semibold text-cyan-400">
          +{mission.rewardGE} GE
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-100">
        {mission.title}
      </h3>
      <p className="mt-1 text-sm text-gray-400">{mission.story}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg" title="Badge reward">
          🏅
        </span>
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[missionStatus] ?? statusColors.notStarted}`}
        >
          {missionStatus}
        </span>
      </div>
    </Link>
  );
}
