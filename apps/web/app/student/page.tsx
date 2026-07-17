"use client";

import Link from "next/link";
import {
  EmptyState,
  GalaxyEnergyChip,
  GalaxyEnergyMeter,
  Layout,
  Metric,
  MissionStatusChip,
  Panel,
  SectionHeader,
  StatusChip,
  AchievementCard,
  type RankStep,
} from "@galaxy/ui";
import { GE_THRESHOLDS, RANK_NAMES } from "@galaxy/config";
import type { Mission, MissionStatus } from "@galaxy/types";
import type { QuizProgress, Submission } from "@galaxy/types";
import { canonicalBadges as badges } from "@/lib/academyContent";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { useSubmissions } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";

const ranks: RankStep[] = Object.entries(GE_THRESHOLDS)
  .map(([rankId, minGE]) => ({ rankId, minGE, name: RANK_NAMES[rankId] ?? rankId }))
  .sort((a, b) => a.minGE - b.minGE);

export default function StudentDashboard() {
  const { user } = useUser();
  const { missions } = useMissionsContext();
  const { submissions } = useSubmissions();
  const orderedMissions = [...missions].sort((a, b) => a.sessionNumber - b.sessionNumber);
  const completedCount = orderedMissions.filter((mission) => user.missionStatus[mission.missionId] === "completed").length;
  const nextMission = orderedMissions.find((mission) => user.missionStatus[mission.missionId] !== "completed");
  const earnedBadges = badges.filter((badge) => user.badgeIds.includes(badge.badgeId));
  const currentRankIndex = Math.max(ranks.findIndex((rank) => rank.rankId === user.rankId), 0);
  const currentRank = ranks[currentRankIndex] ?? ranks[0];
  const nextRank = ranks[currentRankIndex + 1];
  const recentSubmissions = submissions
    .filter((submission) => submission.userId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  return (
    <Layout>
      <header className="mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Explorer cockpit · Student pilot</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Welcome aboard, {user.displayName}</h1>
          <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">Mission systems ready. Choose your next objective and keep R0-B0 learning beside you.</p>
        </div>
        <StatusChip tone="info">Student engineer</StatusChip>
      </header>

      <GalaxyEnergyMeter currentGE={user.totalGE} currentRank={currentRank} nextRank={nextRank} className="mb-6" />

      {nextMission ? <NextMissionPanel mission={nextMission} status={user.missionStatus[nextMission.missionId] ?? "notStarted"} /> : (
        <EmptyState title="Expedition complete" description="Every current mission is complete. R0-B0 is running a proud little systems check." icon="✦" />
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,.75fr)]">
        <section aria-label="Mission journey">
          <SectionHeader title="Mission journey" description={`${completedCount} of ${orderedMissions.length} missions complete · Follow session order`} />
          {orderedMissions.length ? (
            <ol className="grid gap-4 md:grid-cols-2">
              {orderedMissions.map((mission) => (
                <li key={mission.missionId}>
                  <MissionCard
                    mission={mission}
                    status={user.missionStatus[mission.missionId] ?? "notStarted"}
                    quizProgress={mission.quizId ? user.quizzes[mission.quizId] : undefined}
                    hasQuiz={Boolean(mission.quizId)}
                    submission={submissions.find((s) => s.missionId === mission.missionId && s.userId === user.id)}
                  />
                </li>
              ))}
            </ol>
          ) : <EmptyState title="Mission feed is quiet" description="Mission Control is preparing your first assignment. Check back soon." />}
        </section>

        <aside className="space-y-6" aria-label="Explorer status">
          <RobotStatusPanel completed={completedCount} total={orderedMissions.length} nextUpgrade={nextMission?.robotUpgrade} />
          <Panel>
            <SectionHeader title="Academy progress" />
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Metric label="Missions" value={`${completedCount}/${orderedMissions.length}`} icon="◎" />
              <Metric label="Badges" value={`${earnedBadges.length}/${badges.length}`} icon="◇" />
              <Metric label="Galaxy Energy" value={`${user.totalGE} GE`} icon="✦" />
            </div>
          </Panel>
          <RecentActivity submissions={recentSubmissions} missions={orderedMissions} />
        </aside>
      </div>

      <section className="mt-10" aria-label="Recently unlocked badges">
        <SectionHeader title="Recently unlocked" description="Fresh achievements from your expedition" actions={<Link href="/badges" className="inline-flex min-h-11 items-center rounded-xl px-3 font-semibold text-brand hover:bg-brand/10">Enter Badge Hall →</Link>} />
        {earnedBadges.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{earnedBadges.slice(-3).reverse().map((badge) => <AchievementCard key={badge.badgeId} {...badge} unlocked />)}</div> : <EmptyState title="Badge scanners ready" description="Complete missions to unlock your first Academy badge." icon="◇" />}
      </section>
    </Layout>
  );
}

function NextMissionPanel({ mission, status }: { mission: Mission; status: MissionStatus }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/15 via-panel to-brand-secondary/15 p-5 shadow-[var(--shadow-glow-violet)] sm:p-8" aria-labelledby="next-mission-title">
      <div className="absolute -right-16 -top-16 size-48 rounded-full border border-brand/15" aria-hidden="true" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Next mission · Session {mission.sessionNumber}</p><MissionStatusChip status={status} /></div>
          <h2 id="next-mission-title" className="mt-3 font-display text-2xl font-bold text-foreground sm:text-4xl">{mission.title}</h2>
          <p className="mt-3 max-w-3xl text-muted">{mission.summary ?? mission.story}</p>
          <div className="mt-5 flex flex-wrap gap-3"><GalaxyEnergyChip value={mission.rewardGE} />{mission.estimatedMinutes && <StatusChip tone="neutral">◷ {mission.estimatedMinutes} min</StatusChip>}{mission.robotUpgrade && <StatusChip tone="info">R0-B0 upgrade: {mission.robotUpgrade}</StatusChip>}</div>
          <p className="mt-5 text-sm font-medium text-brand">R0-B0: “I’m ready when you are, engineer.”</p>
        </div>
        <Link href={`/mission/${mission.missionId}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand bg-brand px-5 font-bold text-canvas shadow-[var(--shadow-glow-violet)] transition hover:brightness-110">Open Mission <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}

function MissionCard({ mission, status, quizProgress, hasQuiz, submission }: { mission: Mission; status: MissionStatus; quizProgress?: QuizProgress; hasQuiz: boolean; submission?: Submission }) {
  const badgeReward = mission.badgeIds.map((id) => badges.find((badge) => badge.badgeId === id)?.name).filter(Boolean).join(", ");
  const homeworkLabel = submission
    ? submission.status === "needs_revision" ? "✎ Homework: revise" : submission.status === "reviewed" ? "✓ Homework reviewed" : "→ Homework sent"
    : null;
  return (
    <article className="group h-full rounded-2xl border border-border bg-panel/75 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand-secondary/45 motion-reduce:transform-none motion-reduce:transition-none">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-[.14em] text-brand-secondary">Session {mission.sessionNumber}</span><MissionStatusChip status={status} /></div>
      <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{mission.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{mission.summary ?? mission.story}</p>
      <div className="mt-4 flex flex-wrap gap-2"><GalaxyEnergyChip value={mission.rewardGE} />{mission.estimatedMinutes && <StatusChip>◷ {mission.estimatedMinutes} min</StatusChip>}{hasQuiz && (quizProgress?.passed ? <StatusChip tone="success">✓ Quiz passed</StatusChip> : (quizProgress?.attempts ?? 0) > 0 ? <StatusChip tone="warning">Quiz in progress</StatusChip> : <StatusChip tone="neutral">Quiz ready</StatusChip>)}{homeworkLabel && <StatusChip tone={submission?.status === "needs_revision" ? "warning" : submission?.status === "reviewed" ? "success" : "submitted"}>{homeworkLabel}</StatusChip>}</div>
      {(mission.robotUpgrade || badgeReward) && <p className="mt-3 text-xs text-muted">Reward: {mission.robotUpgrade ?? badgeReward}</p>}
      <Link href={`/mission/${mission.missionId}`} aria-label={`Open mission ${mission.title}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-elevated px-4 text-sm font-bold text-foreground transition group-hover:border-brand-secondary group-hover:text-brand-secondary">{status === "completed" ? "Review Mission" : "Open Mission"} <span className="ml-2" aria-hidden="true">→</span></Link>
    </article>
  );
}

function RobotStatusPanel({ completed, total, nextUpgrade }: { completed: number; total: number; nextUpgrade?: string }) {
  const readiness = total ? Math.round((completed / total) * 100) : 0;
  return <Panel><div className="flex items-center gap-4"><span className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl border border-brand/35 bg-brand/10 font-mono font-black text-brand" aria-hidden="true"><span className="absolute top-2 h-1.5 w-5 rounded-full bg-brand" />R0</span><div><p className="text-xs font-bold uppercase tracking-[.14em] text-brand">Companion status</p><h2 className="font-display text-xl font-bold text-foreground">R0-B0 ready</h2><p className="text-sm text-muted">{completed} mission modules learned</p></div></div><div className="mt-5 h-2.5 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-label="R0-B0 academy readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={readiness}><div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-secondary" style={{ width: `${readiness}%` }} /></div><p className="mt-3 text-sm text-muted">{nextUpgrade ? `Next upgrade: ${nextUpgrade}` : completed === total && total ? "All current systems upgraded." : "Next upgrade signal not yet identified."}</p></Panel>;
}

function RecentActivity({ submissions, missions }: { submissions: ReturnType<typeof useSubmissions>["submissions"]; missions: Mission[] }) {
  return <Panel><SectionHeader title="Recent activity" />{submissions.length ? <ul className="space-y-3">{submissions.map((submission) => { const mission = missions.find((item) => item.missionId === submission.missionId); return <li key={submission.submissionId} className="border-l-2 border-brand-secondary/40 pl-3"><p className="text-sm font-semibold text-foreground">{mission?.title ?? "Academy mission"}</p><p className="text-xs text-muted">{submission.status === "needs_revision" ? "Revision requested" : submission.status === "reviewed" ? "Review complete" : "Submitted for review"}</p></li>; })}</ul> : <p className="text-sm text-muted">No mission activity yet. Your first transmission will appear here.</p>}</Panel>;
}
