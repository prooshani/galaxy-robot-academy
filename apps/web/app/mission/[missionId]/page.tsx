"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Checkbox, GalaxyEnergyChip, MissionStatusChip, Panel, ProgressBar, StatusChip } from "@galaxy/ui";
import type { Badge, Submission } from "@galaxy/types";
import { canonicalBadges as badges, getHomeworkByMissionId, getOrderedMissions, normalizeMissionId, QUIZ_PASSING_SCORE, QUIZ_QUESTION_COUNT, QUIZ_REWARD_GE } from "@/lib/academyContent";
import { getNextAvailableMission } from "@/lib/missionExperience";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { useSubmissions } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { MissionSubmissionForm } from "./MissionSubmissionForm";

function latestSubmission(submissions: Submission[], missionId: string, userId: string): Submission | undefined {
  return submissions.find((submission) => submission.missionId === missionId && submission.userId === userId);
}

function nextMissionLabel(nextMission: { missionId: string } | undefined): string {
  return nextMission ? "Open the next mission and keep R0-B0 learning." : "Return to the mission journey — you are all caught up!";
}

export default function MissionDetailPage() {
  const params = useParams();
  const { missions } = useMissionsContext();
  const { user, toggleTaskCompletion } = useUser();
  const { submissions } = useSubmissions();
  const rawMissionId = Array.isArray(params?.missionId) ? params.missionId[0] : params?.missionId;
  // Legacy links (mission-1) resolve to the approved stable IDs (mission-01).
  const missionId = rawMissionId ? normalizeMissionId(rawMissionId) : rawMissionId;
  const mission = missions.find((item) => item.missionId === missionId);

  if (!missionId || !mission) notFound();

  const quizId = mission.quizId;
  const homework = getHomeworkByMissionId(mission.missionId);
  const quizProgress = quizId ? user.quizzes[quizId] : undefined;
  const missionBadges: Badge[] = badges.filter((badge) => mission.badgeIds.includes(badge.badgeId));
  const taskStatus = user.missionTasksCompleted[mission.missionId] ?? {
    requiredTasks: mission.requiredTasks.map(() => false),
    bonusTasks: mission.bonusTasks.map(() => false),
  };
  const requiredComplete = mission.requiredTasks.filter((_, index) => taskStatus.requiredTasks[index] ?? false).length;
  const bonusComplete = mission.bonusTasks.filter((_, index) => taskStatus.bonusTasks[index] ?? false).length;
  const allRequiredComplete = mission.requiredTasks.length > 0 && requiredComplete === mission.requiredTasks.length;
  const submission = latestSubmission(submissions, mission.missionId, user.id);
  const nextMission = getNextAvailableMission(getOrderedMissions(), missions, mission.missionId);
  const missionStatus = submission?.status === "needs_revision" ? "needs_revision" : submission?.status ?? user.missionStatus[mission.missionId] ?? "notStarted";
  const isComplete = user.missionStatus[mission.missionId] === "completed" || (submission?.status === "reviewed" && submission.geAwarded > 0);
  const inProgress = allRequiredComplete || quizProgress?.passed || (quizProgress?.attempts ?? 0) > 0;
  // R0-B0 dialogue comes from the approved per-session messages, keyed off the
  // actual mission state; generic strings are only a fallback.
  const robotMessage = isComplete
    ? mission.robotMessages?.complete ?? "Mission complete. New module ready for installation."
    : submission?.status === "needs_revision"
      ? mission.robotMessages?.revision ?? "Signal needs another scan. Read Mission Control feedback, then resend."
      : submission?.status === "submitted"
        ? mission.robotMessages?.submitted ?? mission.robotMessages?.progress ?? "Transmission received. I will keep systems warm while review is in progress."
        : inProgress
          ? mission.robotMessages?.progress ?? mission.robotMessages?.before ?? "Flight checks complete. Your code bench is ready for transmission."
          : mission.robotMessages?.before ?? "Flight plan loaded. Complete each required check to prepare R0-B0.";
  const nextAction = isComplete
    ? nextMissionLabel(nextMission)
    : submission?.status === "needs_revision"
      ? "Read the feedback, update your code, and resend your homework."
      : submission?.status === "submitted"
        ? "Wait for Mission Control review — your teacher is checking your work."
        : quizId && !quizProgress?.passed
          ? "Take the knowledge check quiz, then send your homework."
          : "Send your homework to Mission Control.";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href="/student" className="inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">← Mission journey</Link></nav>
      <header className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-panel to-brand-secondary/10 p-6 shadow-[var(--shadow-panel)] sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Engineering Bay · Session {mission.sessionNumber}</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{mission.title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-muted">{mission.summary ?? "Prepare R0-B0, complete mission checks, then send your code to Mission Control."}</p></div>
          <div className="flex max-w-lg flex-wrap gap-2"><MissionStatusChip status={missionStatus} /><GalaxyEnergyChip value={mission.rewardGE} />{mission.estimatedMinutes && <StatusChip tone="info">{mission.estimatedMinutes} min</StatusChip>}{mission.robotUpgrade && <StatusChip tone="success">{mission.robotUpgrade}</StatusChip>}</div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-8">
          <Panel><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-secondary">Mission briefing</p><h2 className="mt-2 font-display text-2xl font-bold text-foreground">Why this mission matters</h2><p className="mt-4 max-w-[68ch] text-base leading-7 text-secondary">{mission.story}</p><div className="mt-6 grid gap-5 border-t border-border pt-5 md:grid-cols-2"><div><h3 className="font-semibold text-foreground">Learning objectives</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-muted">{(mission.learningObjectives ?? mission.objectives).map((objective) => <li key={objective} className="flex gap-2"><span className="text-brand" aria-hidden="true">▹</span>{objective}</li>)}</ul></div><div className="space-y-4">{mission.spaceFact && <div><h3 className="font-semibold text-foreground">Space fact</h3><p className="mt-2 text-sm leading-6 text-muted">{mission.spaceFact}</p></div>}{mission.prerequisites && mission.prerequisites.length > 0 && <div><h3 className="font-semibold text-foreground">Before launch</h3><p className="mt-2 text-sm text-muted">{mission.prerequisites.join(" · ")}</p></div>}</div></div></Panel>

          <section aria-labelledby="tasks-heading"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Mission checks</p><h2 id="tasks-heading" className="mt-1 font-display text-2xl font-bold text-foreground">Task checklist</h2></div><StatusChip tone={allRequiredComplete ? "success" : "info"}>{requiredComplete} of {mission.requiredTasks.length} required</StatusChip></div><Panel className="p-0 overflow-hidden"><div className="border-b border-border p-5 sm:p-6"><ProgressBar value={requiredComplete} max={mission.requiredTasks.length} label="Required mission checks" /></div><div className="divide-y divide-border">{mission.requiredTasks.map((task, index) => { const checked = taskStatus.requiredTasks[index] ?? false; return <label key={`${mission.missionId}-required-${index}`} className={`flex min-h-14 cursor-pointer items-center gap-3 px-5 py-3 transition sm:px-6 ${checked ? "bg-success/10" : "hover:bg-white/5"}`}><Checkbox checked={checked} onChange={() => toggleTaskCompletion(mission.missionId, false, index)} /><span className={`text-sm leading-6 ${checked ? "text-success line-through" : "text-foreground"}`}>{task}</span></label>; })}</div></Panel>{allRequiredComplete && <p className="mt-3 rounded-xl border border-success/35 bg-success/10 px-4 py-3 text-sm font-semibold text-success" role="status">All required tasks complete. Code bench unlocked.</p>}</section>

          {mission.bonusTasks.length > 0 && <section aria-labelledby="bonus-heading"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-energy">Optional boost</p><h2 id="bonus-heading" className="mt-1 font-display text-xl font-bold text-foreground">Bonus tasks</h2></div><StatusChip tone="warning">{bonusComplete} of {mission.bonusTasks.length} complete</StatusChip></div><Panel className="divide-y divide-border p-0">{mission.bonusTasks.map((task, index) => { const checked = taskStatus.bonusTasks[index] ?? false; return <label key={`${mission.missionId}-bonus-${index}`} className={`flex min-h-14 cursor-pointer items-center gap-3 px-5 py-3 transition sm:px-6 ${checked ? "bg-warning/10" : "hover:bg-white/5"}`}><Checkbox checked={checked} onChange={() => toggleTaskCompletion(mission.missionId, true, index)} /><span className={`text-sm leading-6 ${checked ? "text-warning line-through" : "text-foreground"}`}>{task}</span></label>; })}</Panel></section>}

          {quizId && (
            <section aria-labelledby="quiz-heading">
              <Panel className="border-brand-secondary/35">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-secondary">Knowledge check</p>
                    <h2 id="quiz-heading" className="mt-1 font-display text-2xl font-bold text-foreground">Session {mission.sessionNumber} quiz</h2>
                  </div>
                  {quizProgress?.passed ? (
                    <StatusChip tone="success">Passed · best {quizProgress.bestScore}/{QUIZ_QUESTION_COUNT}</StatusChip>
                  ) : (quizProgress?.attempts ?? 0) > 0 ? (
                    <StatusChip tone="warning">Best {quizProgress?.bestScore ?? 0}/{QUIZ_QUESTION_COUNT} · keep trying</StatusChip>
                  ) : (
                    <StatusChip tone="info">Not started</StatusChip>
                  )}
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                  {QUIZ_QUESTION_COUNT} quick questions on this session. Pass with {QUIZ_PASSING_SCORE} or more to earn {QUIZ_REWARD_GE} GE — retries are unlimited and never lose GE.
                </p>
                <Link
                  href={`/mission/${mission.missionId}/quiz`}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-brand-secondary bg-brand-secondary/15 px-4 text-sm font-semibold text-foreground transition hover:bg-brand-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {quizProgress?.passed ? "Review the quiz" : (quizProgress?.attempts ?? 0) > 0 ? "Try the quiz again" : "Take the quiz"} →
                </Link>
              </Panel>
            </section>
          )}

          <MissionSubmissionForm missionId={mission.missionId} homework={homework} submission={submission} instructions={mission.submissionInstructions} />

          {isComplete && <Panel className="border-success/40 bg-success/10"><p className="text-xs font-bold uppercase tracking-[.16em] text-success">Mission complete</p><h2 className="mt-2 font-display text-2xl font-bold text-foreground">R0-B0 upgrade installed</h2><p className="mt-2 text-sm leading-6 text-muted">{submission?.geAwarded ?? mission.rewardGE} GE recorded. {mission.robotUpgrade ?? "New engineering capability online."}</p><div className="mt-5 flex flex-wrap gap-3">{missionBadges.map((badge) => <StatusChip key={badge.badgeId} tone="success">{badge.name}</StatusChip>)}</div><Link href={nextMission ? `/mission/${nextMission.missionId}` : "/student"} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-brand bg-brand px-4 text-sm font-semibold text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{nextMission ? "Open next mission" : "Return to mission journey"}</Link></Panel>}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start" aria-label="Mission progress">
          <Panel><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Flight status</p><h2 className="mt-1 font-display text-xl font-bold text-foreground">Mission progress</h2><div className="mt-5 space-y-4"><ProgressBar value={requiredComplete} max={mission.requiredTasks.length} label="Required checks" />{mission.bonusTasks.length > 0 && <ProgressBar value={bonusComplete} max={mission.bonusTasks.length} label="Bonus checks" />}<div className="border-t border-border pt-4 text-sm"><p className="text-muted">Quiz</p><p className="mt-1 font-semibold text-foreground">{quizId ? quizProgress?.passed ? `Passed · ${quizProgress.bestScore}/${QUIZ_QUESTION_COUNT}` : (quizProgress?.attempts ?? 0) > 0 ? `In progress · best ${quizProgress?.bestScore ?? 0}/${QUIZ_QUESTION_COUNT}` : "Not started" : "No quiz for this mission"}</p></div><div className="border-t border-border pt-4 text-sm"><p className="text-muted">Homework</p><p className="mt-1 font-semibold text-foreground">{submission ? submission.status === "needs_revision" ? "Revision requested" : submission.status === "reviewed" ? "Review complete" : "Awaiting review" : allRequiredComplete ? "Ready to send" : "Not sent yet"}</p></div><div className="border-t border-border pt-4 text-sm"><p className="text-muted">Next action</p><p className="mt-1 font-semibold text-foreground">{nextAction}</p></div></div></Panel>
          <Panel className="border-brand-secondary/35"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-secondary">R0-B0 signal</p><p className="mt-3 text-sm leading-6 text-foreground">{robotMessage}</p><p className="mt-4 text-xs font-semibold text-muted">Session {mission.sessionNumber} of 12 · {mission.robotUpgrade ?? "Upgrade data loading"}</p></Panel>
          <Panel><p className="text-xs font-bold uppercase tracking-[.16em] text-energy">Mission rewards</p><div className="mt-3 flex flex-wrap gap-2"><GalaxyEnergyChip value={mission.rewardGE} />{missionBadges.map((badge) => <StatusChip key={badge.badgeId} tone="success">{badge.name}</StatusChip>)}</div></Panel>
        </aside>
      </div>
    </main>
  );
}
