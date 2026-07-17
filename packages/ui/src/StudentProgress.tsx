import type { ReactNode } from "react";

import { GalaxyEnergyChip, Panel, StatusChip, type StatusTone } from "./Primitives";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export interface RankStep {
  rankId: string;
  name: string;
  minGE: number;
}

export function RankProgress({ currentRank, nextRank, compact = false }: { currentRank: RankStep; nextRank?: RankStep; compact?: boolean }) {
  return (
    <div className={cx("flex items-center gap-3", compact ? "min-w-0" : "rounded-xl border border-brand-secondary/25 bg-brand-secondary/10 p-3")}>
      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-secondary/45 bg-canvas/60 text-lg text-brand-secondary" aria-hidden="true">
        <span className="absolute inset-1 rounded-full border border-dashed border-brand-secondary/30" />
        ✦
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-muted">Current rank</p>
        <p className="truncate font-display text-lg font-bold text-foreground">{currentRank.name}</p>
        {nextRank && <p className="text-xs text-muted">Next: {nextRank.name}</p>}
      </div>
    </div>
  );
}

export function GalaxyEnergyMeter({ currentGE, currentRank, nextRank, className }: { currentGE: number; currentRank: RankStep; nextRank?: RankStep; className?: string }) {
  const start = currentRank.minGE;
  const end = nextRank?.minGE;
  const range = end ? Math.max(end - start, 1) : 1;
  const rankProgress = end ? Math.min(Math.max(currentGE - start, 0), range) : range;
  const percent = end ? Math.round((rankProgress / range) * 100) : 100;
  const remaining = end ? Math.max(end - currentGE, 0) : 0;

  return (
    <Panel className={cx("overflow-hidden", className)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <RankProgress currentRank={currentRank} nextRank={nextRank} compact />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-muted">Galaxy Energy</p><p className="font-display text-3xl font-bold text-energy">{currentGE} <span className="text-base">GE</span></p></div>
            <p className="text-sm font-medium text-muted">{nextRank ? `${remaining} GE to ${nextRank.name}` : "Maximum rank achieved"}</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full border border-border bg-canvas" role="progressbar" aria-label={nextRank ? `Galaxy Energy progress toward ${nextRank.name}` : "Galaxy Energy rank progress complete"} aria-valuemin={0} aria-valuemax={end ?? currentGE} aria-valuenow={nextRank ? currentGE : (currentGE || 1)} aria-valuetext={nextRank ? `${currentGE} GE; ${remaining} GE remaining to ${nextRank.name}` : `${currentGE} GE; maximum rank achieved`}>
            <div className="h-full rounded-full bg-gradient-to-r from-energy via-brand to-brand-secondary transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

const missionStatus: Record<string, { label: string; tone: StatusTone }> = {
  notStarted: { label: "Not Started", tone: "neutral" },
  inProgress: { label: "In Progress", tone: "info" },
  submitted: { label: "Awaiting Review", tone: "submitted" },
  needs_revision: { label: "Needs Revision", tone: "warning" },
  reviewed: { label: "Reviewed", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  locked: { label: "Locked", tone: "locked" },
};

export function MissionStatusChip({ status }: { status: string }) {
  const presentation = missionStatus[status] ?? missionStatus.notStarted;
  return <StatusChip tone={presentation.tone}>{presentation.label}</StatusChip>;
}

export function AchievementCard({ name, description, icon, unlocked, missionLabel }: { name: string; description: string; icon: string; unlocked: boolean; missionLabel?: string }) {
  return (
    <article className={cx("relative overflow-hidden rounded-2xl border p-5 transition duration-200 motion-reduce:transition-none", unlocked ? "border-brand/35 bg-gradient-to-br from-brand/12 to-panel shadow-[var(--shadow-glow-violet)]" : "border-border bg-panel/55")}>
      <div className="flex items-start gap-4">
        <span className={cx("flex size-14 shrink-0 items-center justify-center rounded-2xl border text-2xl", unlocked ? "border-brand/40 bg-brand/10" : "border-border bg-canvas/50 grayscale")} aria-hidden="true">{unlocked ? icon : "◇"}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-display text-lg font-semibold text-foreground">{name}</h3><StatusChip tone={unlocked ? "success" : "locked"}>{unlocked ? "Unlocked" : "Locked"}</StatusChip></div>
          <p className="mt-2 text-sm text-muted">{description}</p>
          {missionLabel && <p className="mt-3 text-xs font-semibold uppercase tracking-[.12em] text-brand-secondary">{missionLabel}</p>}
        </div>
      </div>
    </article>
  );
}

export function Metric({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-canvas/35 p-3"><span className="text-xl text-brand" aria-hidden="true">{icon}</span><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">{label}</p><p className="font-display text-xl font-bold text-foreground">{value}</p></div></div>;
}

export { GalaxyEnergyChip };
