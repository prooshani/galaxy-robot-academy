import Link from "next/link";
import { Layout } from "@galaxy/ui";
import { missions, user, badges } from "@/lib/sampleData";
import { getRankName } from "@galaxy/config";

export default function StudentDashboard() {
  const earnedBadges = badges.filter((b) =>
    user.badgeIds.includes(b.badgeId)
  );
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

      {/* All Missions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-200">
          All Missions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {missions.map((mission) => (
            <MissionCard key={mission.missionId} mission={mission} />
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
  key: string;
  mission: {
    missionId: string;
    sessionNumber: number;
    title: string;
    story: string;
    rewardGE: number;
    badgeIds: string[];
  };
}

function MissionCard({ mission }: MissionCardProps) {
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
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg" title="Badge reward">
          🏅
        </span>
        <span className="text-xs text-gray-500">
          View mission details
        </span>
      </div>
    </Link>
  );
}
