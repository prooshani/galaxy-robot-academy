"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Layout } from "@galaxy/ui";
import { canonicalBadges as badges } from "@/lib/academyContent";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import type { Badge } from "@galaxy/types";
import { MissionSubmissionForm } from "./MissionSubmissionForm";

export default function MissionDetailPage() {
  const params = useParams();
  const { missions } = useMissionsContext();

  const missionId = Array.isArray(params?.missionId)
    ? params.missionId[0]
    : params?.missionId;

  const { user, toggleTaskCompletion } = useUser();

  const mission = missions.find((m) => m.missionId === missionId);

  if (!missionId || !mission) {
    notFound();
  }

  const missionBadges: Badge[] = badges.filter((b) =>
    mission.badgeIds.includes(b.badgeId)
  );

  const requiredTasks = mission.requiredTasks;
  const bonusTasks = mission.bonusTasks;

  const taskStatus = user.missionTasksCompleted[mission.missionId] ?? {
    requiredTasks: requiredTasks.map(() => false),
    bonusTasks: bonusTasks.map(() => false),
  };

  const allRequiredComplete =
    requiredTasks.length > 0 &&
    requiredTasks.every((_, i) => taskStatus.requiredTasks[i] ?? false);

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
          <div className="space-y-2">
            {requiredTasks.map((task, index) => {
              const isCompleted = taskStatus.requiredTasks[index] ?? false;
              return (
                <label
                  key={`${mission.missionId}-req-${index}`}
                  className={`flex items-center gap-3 rounded-md border p-2 transition-colors ${
                    isCompleted
                      ? "border-green-500/50 bg-green-900/20 text-green-300"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-purple-500/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleTaskCompletion(mission.missionId, false, index)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:outline-none"
                    aria-label={task}
                  />
                  <span className={isCompleted ? "line-through opacity-70" : ""}>
                    {task}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Bonus Tasks */}
        {bonusTasks.length > 0 && (
          <section className="rounded-lg border border-purple-500/30 bg-[#111827] p-5 shadow-md">
            <h2 className="mb-3 text-lg font-semibold text-yellow-400">
              Bonus Tasks
            </h2>
            <div className="space-y-2">
              {bonusTasks.map((task, index) => {
                const isCompleted = taskStatus.bonusTasks[index] ?? false;
                return (
                  <label
                    key={`${mission.missionId}-bon-${index}`}
                    className={`flex items-center gap-3 rounded-md border p-2 transition-colors ${
                      isCompleted
                        ? "border-yellow-500/50 bg-yellow-900/20 text-yellow-300"
                        : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-purple-500/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleTaskCompletion(mission.missionId, true, index)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:outline-none"
                      aria-label={task}
                      />
                    <span className={isCompleted ? "line-through opacity-70" : ""}>
                      {task}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {/* All tasks completed banner */}
        {allRequiredComplete && (
          <div className="rounded-lg border border-green-500/30 bg-green-900/10 p-4 text-center">
            <p className="text-green-400 font-semibold">
              All required tasks completed! You can submit your code.
            </p>
          </div>
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
          <Link
            href="/student"
            className="text-purple-400 underline hover:text-purple-300 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}
