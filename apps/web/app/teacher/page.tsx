"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@galaxy/ui";
import { canTeach, type Mission, type Submission } from "@galaxy/types";
import { useSubmissions, type SubmissionActionResult } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { canonicalBadges, getHomeworkByMissionId, QUIZ_QUESTION_COUNT } from "@/lib/academyContent";
import type { ReviewAction } from "@/lib/submissionLogic";

const statusLabel = { submitted: "Pending review", reviewed: "Reviewed", needs_revision: "Needs revision" } as const;
const statusStyle = { submitted: "border-warning/40 bg-warning/10 text-yellow-200", reviewed: "border-success/40 bg-success/10 text-green-200", needs_revision: "border-danger/40 bg-danger/10 text-red-200" } as const;
const statusPriority = { submitted: 0, needs_revision: 1, reviewed: 2 } as const;
const button = "inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition hover:brightness-110";

function ReviewDialog({ submission, mission, onClose, onReview }: { submission: Submission; mission?: Mission; onClose: () => void; onReview: (action: ReviewAction, ge: number, feedback: string) => Promise<SubmissionActionResult> }) {
  const readOnly = submission.status === "reviewed";
  const homework = getHomeworkByMissionId(submission.missionId);
  const hasQuiz = Boolean(mission?.quizId);
  const missionBadges = (mission?.badgeIds ?? []).map((id) => canonicalBadges.find((b) => b.badgeId === id)).filter((b): b is NonNullable<typeof b> => Boolean(b));
  const dialog = useRef<HTMLDialogElement>(null);
  const [ge, setGe] = useState(String(submission.geAwarded > 0 ? submission.geAwarded : homework?.rewardGE ?? 0));
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [outcome, setOutcome] = useState<ReviewAction>("approve");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const studentLabel = submission.studentName ?? submission.userId;
  const quizStatus = submission.quizProgress
    ? submission.quizProgress.passed
      ? `Passed · best ${submission.quizProgress.bestScore}/${QUIZ_QUESTION_COUNT} in ${submission.quizProgress.attempts} attempt${submission.quizProgress.attempts === 1 ? "" : "s"}`
      : `Not passed yet · best ${submission.quizProgress.bestScore}/${QUIZ_QUESTION_COUNT}`
    : hasQuiz
      ? "Not started"
      : "No quiz for this mission";
  useEffect(() => { const node = dialog.current; node?.showModal(); const cancel = (event: Event) => { event.preventDefault(); onClose(); }; node?.addEventListener("cancel", cancel); return () => node?.removeEventListener("cancel", cancel); }, [onClose]);
  async function submit() {
    const value = Number.parseInt(ge, 10);
    if (outcome !== "request_revision" && (!Number.isInteger(value) || value < 1 || value > 100)) return setError("Enter a GE award between 1 and 100.");
    if (outcome === "request_revision" && !feedback.trim()) return setError("Add feedback explaining requested revision.");
    setSaving(true);
    setError("");
    const result = await onReview(outcome, outcome === "request_revision" ? 0 : value, feedback.trim());
    setSaving(false);
    if (!result.ok) { setError(result.error ?? "Review failed. Try again."); return; }
    onClose();
  }
  return <dialog ref={dialog} aria-labelledby="review-title" aria-describedby="review-description" className="m-auto w-[min(48rem,calc(100%-2rem))] rounded-2xl border border-[hsl(var(--strong-border))] bg-elevated p-0 text-foreground shadow-2xl backdrop:bg-canvas/80" onClose={onClose}>
    <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Submission review</p><h2 id="review-title" className="mt-2 text-2xl font-bold">{mission?.title ?? "Unknown mission"}</h2><p id="review-description" className="mt-1 text-sm text-muted">{studentLabel} · Session {mission?.sessionNumber ?? "?"} · {new Date(submission.timestamp).toLocaleString()}{(submission.resubmissionCount ?? 0) > 0 && ` · resubmission #${submission.resubmissionCount}`}</p></div><button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded-xl border border-border" aria-label="Close review">×</button></div>
      <dl className="mt-5 grid gap-3 rounded-xl border border-border bg-canvas/45 p-4 text-sm sm:grid-cols-2">
        <div><dt className="text-xs uppercase tracking-wider text-muted">Quiz status</dt><dd className="mt-1 font-semibold">{quizStatus}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-muted">Badge opportunity</dt><dd className="mt-1 font-semibold">{missionBadges.length ? missionBadges.map((b) => `${b.icon} ${b.name}`).join(", ") : "None"}{(submission.badgeAwardedIds?.length ?? 0) > 0 && " · already awarded"}</dd></div>
      </dl>
      <section className="mt-6"><h3 className="text-sm font-semibold">Submitted code</h3><pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-canvas p-4 font-mono text-sm leading-6 text-slate-200"><code>{submission.codeSnippet || "No code submitted."}</code></pre></section>
      <section className="mt-5"><h3 className="text-sm font-semibold">{homework?.reflectionPrompt ?? "Student reflection"}</h3><p className="mt-2 rounded-xl border border-border bg-canvas/45 p-4 text-sm leading-6 text-slate-200">{submission.reflection || "No reflection submitted."}</p></section>
      {error && <p role="alert" className="mt-4 rounded-xl border border-danger/50 bg-danger/10 p-3 text-sm text-red-200">{error}</p>}
      {readOnly && <p className="mt-5 rounded-xl border border-success/40 bg-success/10 p-3 text-sm text-green-100">Review complete. GE, badges, and outcome are locked to prevent duplicate awards.{submission.excellent && " Marked as excellent."}</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-[11rem_1fr]"><label className="text-sm font-semibold">GE award<input type="number" min="1" max="100" value={ge} onChange={(e) => setGe(e.target.value)} className="mt-2 w-full px-4" disabled={readOnly} /><span className="mt-1 block text-xs font-normal text-muted">Guide: up to {homework?.rewardGE ?? mission?.rewardGE ?? 0} GE. Awarded once.</span></label><label className="text-sm font-semibold">Feedback<textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="One thing that worked, one improvement, one next action" disabled={readOnly} /></label></div>
      {!readOnly && <fieldset className="mt-5"><legend className="text-sm font-semibold">Review outcome</legend><div className="mt-2 grid gap-3 sm:grid-cols-3"><label className="flex min-h-12 items-center gap-3 rounded-xl border border-border p-3"><input type="radio" name="outcome" checked={outcome === "approve"} onChange={() => setOutcome("approve")} />Approve</label><label className="flex min-h-12 items-center gap-3 rounded-xl border border-border p-3"><input type="radio" name="outcome" checked={outcome === "approve_excellent"} onChange={() => setOutcome("approve_excellent")} />Approve as excellent</label><label className="flex min-h-12 items-center gap-3 rounded-xl border border-border p-3"><input type="radio" name="outcome" checked={outcome === "request_revision"} onChange={() => setOutcome("request_revision")} />Request revision</label></div>{outcome !== "request_revision" && missionBadges.length > 0 && <p className="mt-3 text-sm text-muted">Approving awards {missionBadges.map((b) => b.name).join(", ")} automatically (once).</p>}</fieldset>}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className={`${button} border border-border`}>{readOnly ? "Close" : "Cancel"}</button>{!readOnly && <button type="button" onClick={() => void submit()} disabled={saving} className={`${button} ${outcome === "request_revision" ? "bg-danger text-slate-950" : "bg-brand text-slate-950"} disabled:opacity-60`}>{saving ? "Saving…" : outcome === "approve" ? "Approve submission" : outcome === "approve_excellent" ? "Approve as excellent" : "Request revision"}</button>}</div>
    </div></dialog>;
}

function DeleteMissionDialog({ mission, onClose, onDelete }: { mission: Mission; onClose: () => void; onDelete: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    node?.showModal();
    const cancel = (event: Event) => { event.preventDefault(); onClose(); };
    node?.addEventListener("cancel", cancel);
    return () => {
      node?.removeEventListener("cancel", cancel);
      opener?.focus();
    };
  }, [onClose]);
  return <dialog ref={dialog} aria-labelledby="delete-title" aria-describedby="delete-description" onClose={onClose} className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-danger/50 bg-elevated p-6 text-foreground shadow-2xl backdrop:bg-canvas/80"><p className="text-xs font-bold uppercase tracking-wider text-danger">Destructive action</p><h2 id="delete-title" className="mt-2 text-xl font-bold">Delete “{mission.title}”?</h2><p id="delete-description" className="mt-2 text-sm text-muted">This removes mission from this device and cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className={`${button} border border-border`}>Cancel</button><button type="button" onClick={onDelete} className={`${button} bg-danger text-slate-950`}>Delete mission</button></div></dialog>;
}

export default function TeacherDashboard() {
  const { user, authStatus } = useUser(); const { submissions, status: submissionsStatus, reviewSubmission } = useSubmissions(); const { missions, deleteMission } = useMissionsContext(); const [reviewing, setReviewing] = useState<Submission | null>(null); const [deleting, setDeleting] = useState<Mission | null>(null);
  const orderedMissions = useMemo(() => [...missions].sort((a, b) => a.sessionNumber - b.sessionNumber), [missions]);
  const orderedSubmissions = useMemo(() => [...submissions].sort((a, b) => statusPriority[a.status] - statusPriority[b.status] || Date.parse(b.timestamp) - Date.parse(a.timestamp)), [submissions]);
  // RoleGuard already enforces teacher-only access; this is a defensive fallback.
  if (authStatus === "authed" && !canTeach(user.role)) return <Layout title="Mission Control"><p>Access denied. <Link href="/login" className="text-brand underline">Sign in as a teacher</Link>.</p></Layout>;
  const missionFor = (id: string) => missions.find((mission) => mission.missionId === id);
  // Awards (GE + badges) happen server-side in a transaction, exactly once —
  // this handler only relays the teacher's decision and surfaces errors.
  async function completeReview(action: ReviewAction, ge: number, feedback: string): Promise<SubmissionActionResult> {
    if (!reviewing || reviewing.status === "reviewed") return { ok: false, error: "This submission is already locked." };
    return reviewSubmission({ submissionId: reviewing.submissionId, action, feedback, geAward: action === "request_revision" ? 0 : ge });
  }
  const metrics = [{ label: "Total missions", value: missions.length }, { label: "Pending review", value: submissions.filter((item) => item.status === "submitted").length }, { label: "Reviewed", value: submissions.filter((item) => item.status === "reviewed").length }, { label: "Revisions", value: submissions.filter((item) => item.status === "needs_revision").length }];
  return <Layout><main className="space-y-8"><header className="surface overflow-hidden rounded-2xl p-6 sm:p-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-brand">Teacher operations</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mission Control</h1><p className="mt-2 max-w-xl text-muted">Review student transmissions, manage mission order, and award Galaxy Energy.</p><p className="mt-3 text-sm text-slate-300">{user.displayName || "Teacher"} · Mission Control operator</p></div><Link href="/teacher/missions/new" className={`${button} bg-brand px-5 text-slate-950`}>+ Create mission</Link></div><dl className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="rounded-xl border border-border bg-canvas/55 p-4"><dt className="text-xs uppercase tracking-wider text-muted">{metric.label}</dt><dd className="mt-1 text-2xl font-bold">{metric.value}</dd></div>)}</dl></header>
    <nav aria-label="Mission Control sections" className="flex gap-2 overflow-x-auto border-b border-border pb-3"><a href="#reviews" className="rounded-lg px-3 py-2 text-sm font-semibold text-brand">Review queue</a><a href="#missions" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">Missions</a></nav>
    <section id="reviews" aria-labelledby="reviews-title"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-warning">Priority operations</p><h2 id="reviews-title" className="mt-1 text-2xl font-bold">Review queue</h2></div><span className="text-sm text-muted">{submissions.length} total</span></div>
      {submissionsStatus === "loading" ? <div className="surface mt-4 rounded-2xl p-8 text-center" role="status"><h3 className="font-bold">Loading transmissions…</h3><p className="mt-2 text-sm text-muted">Fetching student submissions from Mission Control.</p></div> : submissionsStatus === "error" ? <div className="surface mt-4 rounded-2xl p-8 text-center" role="alert"><h3 className="font-bold">Signal lost</h3><p className="mt-2 text-sm text-muted">Could not load submissions. Refresh the page to retry.</p></div> : orderedSubmissions.length === 0 ? <div className="surface mt-4 rounded-2xl p-8 text-center"><h3 className="font-bold">Review queue clear</h3><p className="mt-2 text-sm text-muted">All transmissions processed. New student work will appear here.</p></div> : <><div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border bg-panel/80 md:block" tabIndex={0} aria-label="Student review queue table"><table className="w-full min-w-[820px] text-sm"><caption className="sr-only">Student submissions ordered by review priority</caption><thead className="bg-command/80"><tr>{["Student", "Mission", "Submitted", "Status", "Code", "GE", "Feedback", "Action"].map((head) => <th key={head} scope="col" className="px-4 py-3 text-left text-xs uppercase tracking-wider">{head}</th>)}</tr></thead><tbody>{orderedSubmissions.map((sub) => <tr key={sub.submissionId} className="border-t border-border"><td className="px-4 py-4 font-semibold">{sub.studentName ?? sub.userId}</td><td className="px-4 py-4">{missionFor(sub.missionId)?.title ?? "Unknown mission"}</td><td className="px-4 py-4 text-muted">{new Date(sub.timestamp).toLocaleDateString()}</td><td className="px-4 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs ${statusStyle[sub.status]}`}>{statusLabel[sub.status]}</span></td><td className="px-4 py-4 font-mono text-xs">{sub.codeSnippet ? "Available" : "None"}</td><td className="px-4 py-4 text-energy">{sub.geAwarded} GE</td><td className="max-w-44 truncate px-4 py-4 text-muted">{sub.feedback || "No feedback yet"}</td><td className="px-4 py-4"><button type="button" onClick={() => setReviewing(sub)} className={`${button} border border-brand/40 bg-brand/10 text-brand`}>{sub.status === "submitted" ? "Review" : "View / update"}</button></td></tr>)}</tbody></table></div>
      <div className="mt-4 grid gap-3 md:hidden">{orderedSubmissions.map((sub) => <article key={sub.submissionId} className="surface rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{sub.studentName ?? sub.userId}</p><h3 className="mt-1 text-sm text-slate-300">{missionFor(sub.missionId)?.title ?? "Unknown mission"}</h3></div><span className={`rounded-full border px-2.5 py-1 text-xs ${statusStyle[sub.status]}`}>{statusLabel[sub.status]}</span></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-muted">Submitted</dt><dd>{new Date(sub.timestamp).toLocaleDateString()}</dd></div><div><dt className="text-xs text-muted">Code</dt><dd className="font-mono">{sub.codeSnippet ? "Available" : "None"}</dd></div><div><dt className="text-xs text-muted">GE award</dt><dd className="text-energy">{sub.geAwarded} GE</dd></div><div><dt className="text-xs text-muted">Feedback</dt><dd>{sub.feedback || "None yet"}</dd></div></dl><button type="button" onClick={() => setReviewing(sub)} className={`${button} mt-5 w-full bg-brand text-slate-950`}>{sub.status === "submitted" ? "Review submission" : "View / update review"}</button></article>)}</div></>}
    </section>
    <section id="missions" aria-labelledby="missions-title"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Curriculum operations</p><h2 id="missions-title" className="mt-1 text-2xl font-bold">Mission overview</h2></div><Link href="/teacher/missions/new" className="text-sm font-semibold text-brand hover:underline">Create mission</Link></div>{orderedMissions.length === 0 ? <div className="surface mt-4 rounded-2xl p-8 text-center"><h3 className="font-bold">No missions configured</h3><p className="mt-2 text-sm text-muted">Create first mission transmission for academy.</p></div> : <div className="mt-4 grid gap-3">{orderedMissions.map((mission) => <article key={mission.missionId} className="surface grid gap-4 rounded-2xl p-5 lg:grid-cols-[5rem_1fr_auto_auto_auto] lg:items-center"><div><p className="text-xs uppercase text-muted">Session</p><p className="text-xl font-bold text-brand">{mission.sessionNumber}</p></div><div><h3 className="font-bold">{mission.title}</h3><p className="mt-1 text-sm text-muted">{mission.status ?? "Published"}</p></div><div className="text-sm"><span className="text-muted">Submissions </span><strong>{submissions.filter((sub) => sub.missionId === mission.missionId).length}</strong></div><div className="text-sm font-semibold text-energy">{mission.rewardGE} GE</div><div className="flex gap-2"><Link href={`/teacher/missions/${mission.missionId}/edit`} className={`${button} border border-border`}>Edit</Link><button type="button" onClick={() => setDeleting(mission)} className={`${button} border border-danger/50 text-red-200`}>Delete</button></div></article>)}</div>}</section>
    {reviewing && <ReviewDialog submission={reviewing} mission={missionFor(reviewing.missionId)} onClose={() => setReviewing(null)} onReview={completeReview} />}
    {deleting && <DeleteMissionDialog mission={deleting} onClose={() => setDeleting(null)} onDelete={() => { deleteMission(deleting.missionId); setDeleting(null); }} />}
  </main></Layout>;
}
