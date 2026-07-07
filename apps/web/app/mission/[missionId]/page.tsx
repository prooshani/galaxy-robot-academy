import { notFound } from "next/navigation";
import { Layout } from "@galaxy/ui";
import { missions, badges } from "@/lib/sampleData";
import type { Badge } from "@galaxy/types";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;

  const mission = missions.find((m) => m.missionId === missionId);

  if (!mission) {
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

        {/* Coming Soon Banner */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-5 text-center">
          <p className="text-2xl">🚧</p>
          <h3 className="mt-1 text-lg font-semibold text-blue-300">
            Submission Coming Soon
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            You will soon be able to submit your solutions directly from this
            page. For now, review the mission details and complete the tasks
            to earn your rewards!
          </p>
          <button
            disabled
            className="mt-3 inline-block rounded-lg border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 opacity-50"
          >
            Submit Mission (Coming Soon)
          </button>
        </div>

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
