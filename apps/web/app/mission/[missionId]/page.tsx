"use client";

import { useParams, notFound } from "next/navigation";
import { Layout } from "@galaxy/ui";
import { badges } from "@/lib/sampleData";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import type { Badge } from "@galaxy/types";
import { MissionSubmissionForm } from "./MissionSubmissionForm";

export default function MissionDetailPage() {
  const params = useParams();
  const { missions } = useMissionsContext();

  const missionId = Array.isArray(params?.missionId)
    ? params.missionId[0]
    : params?.missionId;

  const mission = missions.find((m) => m.missionId === missionId);

  if (!missionId || !mission) {
    notFound();
  }

  const missionBadges: Badge[] = badges.filter((b) =>
    mission.badgeIds.includes(b.badgeId)
  );

  const requiredTasks = mission.requiredTasks;
  const bonusTasks = mission.bonusTasks;

  return (
    <Layout title={mission.title}>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Mission header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-purple-900/50 px-2 py-0.5 text-xs text-purple-300">
              Session {mission.sessionNumber}
            </span>
            <span className="text-sm font-semibold text-cyan-400">
              +{mission.rewardGE} GE
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-100">
            {mission.title}
          </h1>
        </div>

        {/* Story */}
        <section className="rounded-lg border border-purple-500/30 bg-[#111827] p-5 shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-cyan-400">
            Story
          </h2>
          <p className="text-gray-300">{mission.story}</p>
        </section>

        {/* Objectives */}
        <section className="rounded-lg border border-purple-500/30 bg-[#111827] p-5 shadow-md">
          <h2 className="mb-3 text-lg font-semibold text-cyan-400">
            Objectives
          </h2>
          <ul className="list-inside list-disc space-y-1 text-gray-300">
            {mission.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </section>

        {/* Required Tasks */}
        <section className="rounded-lg border border-cyan-500/30 bg-[#111827] p-5 shadow-md">
          <h2 className="mb-3 text-lg font-semibold text-cyan-400">
            Required Tasks
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-gray-300">
            {requiredTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ol>
        </section>

        {/* Bonus Tasks */}
        {bonusTasks.length > 0 && (
          <section className="rounded-lg border border-pink-500/30 bg-[#111827] p-5 shadow-md">
            <h2 className="mb-3 text-lg font-semibold text-pink-400">
              Bonus Tasks
            </h2>
            <ul className="list-inside list-disc space-y-1 text-gray-300">
              {bonusTasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Rewards */}
        <section className="rounded-lg border border-yellow-500/30 bg-[#111827] p-5 shadow-md">
          <h2 className="mb-3 text-lg font-semibold text-yellow-400">
            Rewards
          </h2>
          <div className="mb-3 text-sm text-gray-400">
            Galaxy Energy: <span className="font-semibold text-cyan-400">+{mission.rewardGE} GE</span>
          </div>
          {missionBadges.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-gray-400">Badges Earned:</p>
              <div className="flex flex-wrap gap-3">
                {missionBadges.map((badge) => (
                  <div
                    key={badge.badgeId}
                    className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2"
                  >
                    <span className="text-xl" title={badge.name}>
                      {badge.icon}
                    </span>
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
            </div>
          )}
        </section>

        <MissionSubmissionForm missionId={mission.missionId} />

        {/* Back link */}
        <div className="text-center">
          <a
            href="/student"
            className="text-purple-400 underline hover:text-purple-300"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </Layout>
  );
}
