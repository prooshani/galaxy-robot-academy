"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import type { Mission } from "@galaxy/types";
import { canonicalBadges as badges } from "@/lib/academyContent";

type MissionInput = Omit<Mission, "missionId">;

export function TeacherMissionForm({ mission, onSave }: { mission?: Mission; onSave: (input: MissionInput) => void }) {
  const [title, setTitle] = useState(mission?.title ?? "");
  const [sessionNumber, setSessionNumber] = useState(mission ? String(mission.sessionNumber) : "");
  const [story, setStory] = useState(mission?.story ?? "");
  const [objectives, setObjectives] = useState(mission?.objectives.join("\n") ?? "");
  const [requiredTasks, setRequiredTasks] = useState(mission?.requiredTasks.join("\n") ?? "");
  const [bonusTasks, setBonusTasks] = useState(mission?.bonusTasks.join("\n") ?? "");
  const [rewardGE, setRewardGE] = useState(mission ? String(mission.rewardGE) : "");
  const [selectedBadges, setSelectedBadges] = useState<string[]>(mission?.badgeIds ?? []);
  const [error, setError] = useState<string | null>(null);
  const splitLines = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

  function submit(event: FormEvent) {
    event.preventDefault();
    const session = Number.parseInt(sessionNumber, 10);
    const ge = Number.parseInt(rewardGE, 10);
    const required = splitLines(requiredTasks);
    if (!title.trim() || !story.trim() || splitLines(objectives).length === 0 || required.length === 0) {
      setError("Complete every required field before saving the mission.");
      return;
    }
    if (!Number.isInteger(session) || session < 1 || !Number.isInteger(ge) || ge < 0) {
      setError("Session must be at least 1 and Galaxy Energy must be 0 or more.");
      return;
    }
    onSave({ sessionNumber: session, title: title.trim(), story: story.trim(), objectives: splitLines(objectives), requiredTasks: required, bonusTasks: splitLines(bonusTasks), rewardGE: ge, badgeIds: selectedBadges });
  }

  const fieldClass = "mt-2 w-full px-4 py-3 text-sm";
  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {error && <div role="alert" className="rounded-xl border border-danger/50 bg-danger/10 p-4 text-sm text-red-200">{error}</div>}
      <section className="surface rounded-2xl p-5 sm:p-6" aria-labelledby="mission-basics">
        <h2 id="mission-basics" className="text-lg font-semibold">Mission briefing</h2>
        <p className="mt-1 text-sm text-muted">Set mission order and explain its purpose.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_10rem]">
          <label className="text-sm font-medium">Mission title <span aria-hidden="true" className="text-danger">*</span><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} required aria-invalid={!!error && !title.trim()} /></label>
          <label className="text-sm font-medium">Session number <span aria-hidden="true" className="text-danger">*</span><input className={fieldClass} type="number" min="1" value={sessionNumber} onChange={(e) => setSessionNumber(e.target.value)} required /></label>
        </div>
        <label className="mt-5 block text-sm font-medium">Story / description <span aria-hidden="true" className="text-danger">*</span><textarea className={fieldClass} value={story} onChange={(e) => setStory(e.target.value)} required /></label>
      </section>
      <section className="surface rounded-2xl p-5 sm:p-6" aria-labelledby="mission-plan">
        <h2 id="mission-plan" className="text-lg font-semibold">Learning plan</h2>
        <p className="mt-1 text-sm text-muted">Enter one item per line. Commas also supported.</p>
        {[{ label: "Objectives", value: objectives, set: setObjectives, required: true }, { label: "Required tasks", value: requiredTasks, set: setRequiredTasks, required: true }, { label: "Bonus tasks", value: bonusTasks, set: setBonusTasks, required: false }].map((field) => (
          <label key={field.label} className="mt-5 block text-sm font-medium">{field.label}{field.required && <span aria-hidden="true" className="text-danger"> *</span>}<textarea className={fieldClass} value={field.value} onChange={(e) => field.set(e.target.value)} required={field.required} /></label>
        ))}
      </section>
      <section className="surface rounded-2xl p-5 sm:p-6" aria-labelledby="mission-rewards">
        <h2 id="mission-rewards" className="text-lg font-semibold">Rewards</h2>
        <label className="mt-5 block max-w-xs text-sm font-medium">Galaxy Energy (GE) <span aria-hidden="true" className="text-danger">*</span><input className={fieldClass} type="number" min="0" value={rewardGE} onChange={(e) => setRewardGE(e.target.value)} required /></label>
        <fieldset className="mt-6"><legend className="text-sm font-medium">Badge rewards</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{badges.map((badge) => <label key={badge.badgeId} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-border bg-canvas/50 px-4 py-3"><input type="checkbox" checked={selectedBadges.includes(badge.badgeId)} onChange={() => setSelectedBadges((current) => current.includes(badge.badgeId) ? current.filter((id) => id !== badge.badgeId) : [...current, badge.badgeId])} /><span aria-hidden="true" className="text-xl">{badge.icon}</span><span className="text-sm">{badge.name}</span></label>)}</div></fieldset>
      </section>
      <div className="sticky bottom-3 z-20 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-command/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:justify-end">
        <Link href="/teacher" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold hover:bg-white/5">Cancel</Link>
        <button type="submit" className="min-h-11 rounded-xl bg-brand px-6 text-sm font-bold text-slate-950 hover:brightness-110">{mission ? "Save changes" : "Create mission"}</button>
      </div>
    </form>
  );
}
