"use client";

import { AchievementCard, EmptyState, Layout, Metric, Panel, SectionHeader } from "@galaxy/ui";
import { useUser } from "@/app/contexts/UserContext";
import { canonicalBadges as badges, canonicalMissions as missions } from "@/lib/academyContent";

export default function BadgesPage() {
  const { user } = useUser();
  const unlocked = badges.filter((badge) => user.badgeIds.includes(badge.badgeId));
  const locked = badges.filter((badge) => !user.badgeIds.includes(badge.badgeId));
  const percent = badges.length ? Math.round((unlocked.length / badges.length) * 100) : 0;
  const missionForBadge = (badgeId: string) => missions.find((mission) => mission.badgeIds.includes(badgeId));

  return (
    <Layout>
      <header className="mb-7 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Academy archive</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Hall of Achievements</h1><p className="mt-3 text-base text-muted sm:text-lg">Every badge marks a system you built, tested, or understood. Your expedition record lives here.</p></header>

      <Panel className="mb-9 bg-gradient-to-br from-brand-secondary/12 to-panel">
        <div className="grid gap-3 sm:grid-cols-3"><Metric label="Unlocked" value={unlocked.length} icon="✦" /><Metric label="Still to discover" value={locked.length} icon="◇" /><Metric label="Hall complete" value={`${percent}%`} icon="◎" /></div>
        <div className="mt-5 h-3 overflow-hidden rounded-full border border-border bg-canvas" role="progressbar" aria-label="Badge Hall completion" aria-valuemin={0} aria-valuemax={badges.length || 1} aria-valuenow={unlocked.length} aria-valuetext={`${unlocked.length} of ${badges.length} badges unlocked`}><div className="h-full rounded-full bg-gradient-to-r from-brand-secondary to-brand transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percent}%` }} /></div>
      </Panel>

      <section aria-label="Unlocked badges">
        <SectionHeader title="Unlocked badges" description="Achievements confirmed by Mission Control" />
        {unlocked.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{unlocked.map((badge) => { const mission = missionForBadge(badge.badgeId); return <AchievementCard key={badge.badgeId} {...badge} unlocked missionLabel={mission ? `Session ${mission.sessionNumber} · ${mission.title}` : undefined} />; })}</div> : <EmptyState title="Your display case is ready" description="Complete a mission to illuminate your first badge." icon="◇" />}
      </section>

      {locked.length > 0 && <section className="mt-10" aria-label="Locked badges"><SectionHeader title="Locked badges" description="Complete missions to reveal classified achievements" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{locked.map((badge) => <AchievementCard key={badge.badgeId} name="Classified Achievement" description="Complete more Academy missions to reveal this badge." icon="▣" unlocked={false} />)}</div></section>}

      {!badges.length && <EmptyState title="Badge archive unavailable" description="Mission Control could not load the achievement catalog. Your progress remains safe." />}
    </Layout>
  );
}
