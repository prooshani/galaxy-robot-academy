"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Layout } from "@galaxy/ui";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { canonicalBadges as badges } from "@/lib/academyContent";

export default function EditMissionPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const { missions, updateMission } = useMissionsContext();

  const missionId = Array.isArray(params?.missionId)
    ? params.missionId[0]
    : params?.missionId;

  const mission = missions.find((m) => m.missionId === missionId);

  // All hooks must be called unconditionally before any early returns
  const [title, setTitle] = useState(mission?.title ?? "");
  const [sessionNumber, setSessionNumber] = useState(
    mission ? String(mission.sessionNumber) : ""
  );
  const [story, setStory] = useState(mission?.story ?? "");
  const [objectives, setObjectives] = useState(
    mission?.objectives.join(", ") ?? ""
  );
  const [requiredTasks, setRequiredTasks] = useState(
    mission?.requiredTasks.join(", ") ?? ""
  );
  const [bonusTasks, setBonusTasks] = useState(
    mission?.bonusTasks.join(", ") ?? ""
  );
  const [rewardGE, setRewardGE] = useState(
    mission ? String(mission.rewardGE) : ""
  );
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    mission?.badgeIds ?? []
  );
  const [error, setError] = useState<string | null>(null);

  // Role guard — must come after all hooks
  if (user.role !== "teacher") {
    return (
      <Layout title="Edit Mission">
        <p className="text-gray-400">
          Access denied. Please{" "}
          <Link href="/role" className="text-cyan-400 underline hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded">
            select the teacher role
          </Link>{" "}
          to access this page.
        </p>
      </Layout>
    );
  }

  // Not found — must come after all hooks
  if (!mission) {
    notFound();
  }

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedSession = Number.parseInt(sessionNumber, 10);
    const parsedGE = Number.parseFloat(rewardGE);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!Number.isFinite(parsedSession) || parsedSession < 1) {
      setError("Session number must be a positive integer.");
      return;
    }
    if (!story.trim()) {
      setError("Story is required.");
      return;
    }
    if (!objectives.trim()) {
      setError("At least one objective is required.");
      return;
    }
    if (!requiredTasks.trim()) {
      setError("At least one required task is required.");
      return;
    }
    if (!Number.isFinite(parsedGE) || parsedGE < 0) {
      setError("Reward GE must be a non-negative number.");
      return;
    }

    updateMission(mission.missionId, {
      title: title.trim(),
      sessionNumber: parsedSession,
      story: story.trim(),
      objectives: objectives
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      requiredTasks: requiredTasks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      bonusTasks: bonusTasks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rewardGE: parsedGE,
      badgeIds: selectedBadges,
    });

    router.push("/teacher");
  };

  return (
    <Layout title="Edit Mission">
      <div className="mx-auto max-w-2xl">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="mission-title"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="mission-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Asteroid Defender"
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Session Number */}
          <div>
            <label
              htmlFor="session-number"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Session Number <span className="text-red-400">*</span>
            </label>
            <input
              id="session-number"
              type="number"
              min="1"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(e.target.value)}
              placeholder="e.g. 5"
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Story */}
          <div>
            <label
              htmlFor="mission-story"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Story / Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="mission-story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell the story behind this mission..."
              rows={3}
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Objectives */}
          <div>
            <label
              htmlFor="mission-objectives"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Objectives <span className="text-red-400">*</span>
            </label>
            <textarea
              id="mission-objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Comma-separated, e.g. Write a loop, Use conditionals, Debug code"
              rows={3}
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Required Tasks */}
          <div>
            <label
              htmlFor="mission-required"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Required Tasks <span className="text-red-400">*</span>
            </label>
            <textarea
              id="mission-required"
              value={requiredTasks}
              onChange={(e) => setRequiredTasks(e.target.value)}
              placeholder="Comma-separated, e.g. Create a loop, Add a variable, Test the program"
              rows={3}
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Bonus Tasks */}
          <div>
            <label
              htmlFor="mission-bonus"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Bonus Tasks{" "}
              <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="mission-bonus"
              value={bonusTasks}
              onChange={(e) => setBonusTasks(e.target.value)}
              placeholder="Comma-separated, e.g. Add comments, Handle errors"
              rows={2}
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Reward GE */}
          <div>
            <label
              htmlFor="reward-ge"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Reward GE <span className="text-red-400">*</span>
            </label>
            <input
              id="reward-ge"
              type="number"
              min="0"
              step="1"
              value={rewardGE}
              onChange={(e) => setRewardGE(e.target.value)}
              placeholder="e.g. 100"
              className="w-full rounded-lg border border-purple-500/30 bg-[#0d1225] px-3 py-2 text-gray-100 placeholder-gray-600 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Badge Selection */}
          <div>
            <span className="mb-2 block text-sm font-medium text-gray-300">
              Badge Rewards
            </span>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => {
                const checked = selectedBadges.includes(badge.badgeId);
                const checkboxId = `edit-badge-${badge.badgeId}`;
                return (
                  <label
                    htmlFor={checkboxId}
                    key={badge.badgeId}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                      checked
                        ? "border-cyan-400/60 bg-cyan-400/10"
                        : "border-purple-500/20 bg-[#111827] hover:border-purple-400/50"
                    }`}
                  >
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBadge(badge.badgeId)}
                      className="h-4 w-4 accent-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                    />
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm text-gray-200">{badge.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-6 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label="Save Changes"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.push("/teacher")}
              className="rounded-lg border border-purple-500/20 bg-[#111827] px-6 py-2.5 text-sm font-semibold text-gray-400 transition-colors hover:border-purple-400/50 hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
              aria-label="Cancel and return to Teacher Dashboard"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
