"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@galaxy/ui";
import type { Submission } from "@galaxy/types";
import { useSubmissions } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { useMissionsContext } from "@/app/contexts/MissionsContext";

type SubmissionStatus = Submission["status"];

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  submitted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  reviewed: "bg-green-500/20 text-green-400 border-green-500/30",
  needs_revision: "bg-red-500/20 text-red-400 border-red-500/30",
};

function getSubmissionCount(submissions: Submission[], missionId: string): number {
  return submissions.filter((s) => s.missionId === missionId).length;
}

function getMissionTitle(missions: { missionId: string; title: string }[], missionId: string): string {
  const mission = missions.find((m) => m.missionId === missionId);
  return mission?.title ?? "Unknown Mission";
}

export default function TeacherDashboard() {
  const { user, awardGE, setMissionStatus } = useUser();
  const router = useRouter();
  const { submissions, reviewSubmission } = useSubmissions();
  const { missions, deleteMission } = useMissionsContext();

  useEffect(() => {
    if (user.role !== "teacher") {
      router.push("/role");
    }
  }, [user.role, router]);

  if (user.role !== "teacher") {
    return (
      <Layout title="Teacher Dashboard">
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

  const handleMarkReviewed = (submission: Submission) => {
    const geInput = window.prompt("Enter GE awarded", "0");

    if (geInput === null) {
      return;
    }

    const geAwarded = Number.parseInt(geInput, 10);

    if (!Number.isFinite(geAwarded) || geAwarded < 0) {
      window.alert("Enter a valid non-negative GE amount.");
      return;
    }

    const feedback = window.prompt("Enter feedback", "") ?? "";
    const mission = missions.find((m) => m.missionId === submission.missionId);

    reviewSubmission({
      submissionId: submission.submissionId,
      geAwarded,
      feedback,
    });

    if (mission && geAwarded > 0) {
      awardGE(submission.missionId, geAwarded, mission.badgeIds);
    } else if (mission) {
      setMissionStatus(submission.missionId, "reviewed");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-cyan-400">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Monitor missions and review student submissions
            </p>
          </div>
          <Link
            href="/teacher/missions/new"
            className="inline-flex items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            aria-label="Create New Mission"
          >
            ✚ Create Mission
          </Link>
        </div>

        {/* Mission Overview */}
        <section className="rounded-lg border border-purple-500/30 bg-[#111827] p-5 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-200">
            Mission Overview
          </h2>
          <div className="overflow-x-auto rounded-lg border border-purple-500/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-500/20 text-gray-400">
                  <th className="pb-3 pl-2 text-left font-medium">
                    Session
                  </th>
                  <th className="pb-3 text-left font-medium">Mission Title</th>
                  <th className="pb-3 text-right font-medium pr-2">
                    Submissions
                  </th>
                  <th className="pb-3 text-right font-medium pr-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {missions.map((mission) => {
                  const count = getSubmissionCount(
                    submissions,
                    mission.missionId
                  );
                  return (
                    <tr
                      key={mission.missionId}
                      className="border-b border-purple-500/10 transition-colors hover:bg-purple-500/5"
                    >
                      <td className="py-3 pl-2 text-gray-300">
                        {mission.sessionNumber}
                      </td>
                      <td className="py-3 text-gray-100 font-medium">
                        {mission.title}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <span className="text-cyan-400 font-semibold">
                          {count}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <Link
                          href={`/teacher/missions/${mission.missionId}/edit`}
                          className="inline-block rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:border-cyan-400 hover:text-cyan-200 mr-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                          aria-label={`Edit ${mission.title}`}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete mission "${mission.title}"?`)) {
                              deleteMission(mission.missionId);
                            }
                          }}
                          className="inline-block rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:border-red-400 hover:text-red-200 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                          aria-label={`Delete ${mission.title}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Submissions Table */}
        <section className="rounded-lg border border-purple-500/30 bg-[#111827] p-5 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-200">
            Student Submissions ({submissions.length})
          </h2>
          <div className="overflow-x-auto rounded-lg border border-purple-500/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-500/20 text-gray-400">
                  <th className="pb-3 pl-2 text-left font-medium">
                    Mission
                  </th>
                  <th className="pb-3 text-left font-medium">Student</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">GE</th>
                  <th className="pb-3 text-left font-medium pr-2">
                    Feedback
                  </th>
                  <th className="pb-3 text-right font-medium pr-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr
                    key={sub.submissionId}
                    className="border-b border-purple-500/10 transition-colors hover:bg-purple-500/5"
                  >
                    <td className="py-3 pl-2 text-gray-100 font-medium">
                      {getMissionTitle(missions, sub.missionId)}
                    </td>
                    <td className="py-3 text-gray-300">{sub.userId}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[sub.status]}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={
                          sub.geAwarded > 0
                            ? "text-cyan-400 font-semibold"
                            : "text-gray-500"
                        }
                      >
                        {sub.geAwarded}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-gray-400 max-w-xs truncate">
                      {sub.feedback ?? "—"}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {sub.status === "submitted" ? (
                        <button
                          type="button"
                          onClick={() => handleMarkReviewed(sub)}
                          className="rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:border-cyan-400 hover:text-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                          aria-label={`Mark ${getMissionTitle(missions, sub.missionId)} submission as reviewed`}
                        >
                          Mark Reviewed
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
