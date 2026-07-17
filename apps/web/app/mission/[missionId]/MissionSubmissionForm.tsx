"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, FormField, Panel, StatusChip, Textarea } from "@galaxy/ui";
import type { HomeworkMission, Submission } from "@galaxy/types";
import { useSubmissions } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import {
  getSubmissionCodeError,
  getSubmissionReflectionError,
} from "@/lib/submissionLogic";

interface MissionSubmissionFormProps {
  missionId: string;
  homework?: HomeworkMission;
  submission?: Submission;
  instructions?: string;
}

interface Draft {
  code: string;
  reflection: string;
}

function draftKey(missionId: string): string {
  return `gra_homeworkDraft_${missionId}`;
}

function loadDraft(missionId: string): Draft {
  if (typeof window === "undefined") return { code: "", reflection: "" };
  try {
    const raw = window.localStorage.getItem(draftKey(missionId));
    if (!raw) return { code: "", reflection: "" };
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      code: typeof parsed.code === "string" ? parsed.code : "",
      reflection: typeof parsed.reflection === "string" ? parsed.reflection : "",
    };
  } catch {
    return { code: "", reflection: "" };
  }
}

export function MissionSubmissionForm({
  missionId,
  homework,
  submission,
  instructions,
}: MissionSubmissionFormProps) {
  const { addSubmission, resubmitSubmission } = useSubmissions();
  const { user, authStatus, setMissionStatus } = useUser();

  const needsRevision = submission?.status === "needs_revision";
  const isAwaitingReview = submission?.status === "submitted";
  const isReviewed = submission?.status === "reviewed";

  const [codeSnippet, setCodeSnippet] = useState("");
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const reflectionPrompt =
    homework?.reflectionPrompt ?? "What did you learn while building this?";

  // Hydrate from the local draft (new submissions) or the previous
  // transmission (revisions) once on mount.
  useEffect(() => {
    if (hydrated) return;
    if (needsRevision && submission) {
      setCodeSnippet(submission.codeSnippet);
      setReflection(submission.reflection ?? "");
    } else if (!submission) {
      const draft = loadDraft(missionId);
      setCodeSnippet(draft.code);
      setReflection(draft.reflection);
    }
    setHydrated(true);
  }, [hydrated, needsRevision, submission, missionId]);

  // Keep an autosaved local draft for unsubmitted work only.
  useEffect(() => {
    if (!hydrated || submission) return;
    try {
      if (codeSnippet || reflection) {
        window.localStorage.setItem(
          draftKey(missionId),
          JSON.stringify({ code: codeSnippet, reflection }),
        );
      } else {
        window.localStorage.removeItem(draftKey(missionId));
      }
    } catch {
      // Draft persistence is best-effort.
    }
  }, [codeSnippet, reflection, hydrated, submission, missionId]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(draftKey(missionId));
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const codeError = getSubmissionCodeError(codeSnippet);
    const reflectionError = getSubmissionReflectionError(reflection);
    if (codeError || reflectionError) {
      setError(codeError ?? reflectionError ?? "");
      return;
    }

    setSending(true);
    setError("");
    const result = needsRevision && submission
      ? await resubmitSubmission({
          submissionId: submission.submissionId,
          codeSnippet: codeSnippet.trim(),
          reflection: reflection.trim(),
        })
      : await addSubmission({
          missionId,
          codeSnippet: codeSnippet.trim(),
          reflection: reflection.trim(),
        });
    setSending(false);

    if (!result.ok) {
      setError(result.error ?? "Transmission failed. Try again.");
      return;
    }

    clearDraft();
    setMissionStatus(missionId, "submitted");
    setJustSent(true);
  };

  const statusChip = useMemo(() => {
    if (isAwaitingReview) return <StatusChip tone="submitted">Awaiting review</StatusChip>;
    if (needsRevision) return <StatusChip tone="warning">Needs another scan</StatusChip>;
    if (isReviewed) return <StatusChip tone="success">Review complete</StatusChip>;
    return null;
  }, [isAwaitingReview, needsRevision, isReviewed]);

  return (
    <Panel className="scroll-mt-6 border-brand/35" aria-labelledby="submission-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Homework bay</p>
          <h2 id="submission-heading" className="mt-1 font-display text-2xl font-bold text-foreground">
            {homework?.title ?? "Send transmission"}
          </h2>
        </div>
        {statusChip}
      </div>

      {homework && (
        <div className="mt-4 rounded-xl border border-border bg-canvas/45 p-4">
          <p className="text-sm leading-6 text-secondary">{homework.summary}</p>
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-muted">
            {homework.requiredTasks.map((task) => (
              <li key={task} className="flex gap-2">
                <span className="text-brand" aria-hidden="true">▹</span>
                {task}
              </li>
            ))}
          </ul>
          {homework.bonusChallenge && (
            <p className="mt-3 text-sm leading-6 text-energy">Bonus: {homework.bonusChallenge}</p>
          )}
        </div>
      )}

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        {instructions ?? "Paste your mission code here. This sends code to Mission Control; it does not run code."}
      </p>

      {submission?.feedback && (
        <aside
          className={`mt-5 rounded-xl border p-4 ${isReviewed ? "border-success/35 bg-success/10" : "border-warning/35 bg-warning/10"}`}
          aria-live="polite"
        >
          <p className={`text-xs font-bold uppercase tracking-[.14em] ${isReviewed ? "text-success" : "text-warning"}`}>
            Transmission from Mission Control
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">{submission.feedback}</p>
          {submission.excellent && (
            <p className="mt-2 text-sm font-semibold text-success">Marked as excellent work! ★</p>
          )}
          {submission.geAwarded > 0 && (
            <p className="mt-2 text-sm font-semibold text-energy">{submission.geAwarded} GE awarded</p>
          )}
        </aside>
      )}

      {authStatus === "anon" ? (
        <div className="mt-6 rounded-xl border border-border bg-canvas/45 p-4 text-sm text-muted">
          <Link href="/login" className="font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            Sign in
          </Link>{" "}
          to send your homework to Mission Control.
        </div>
      ) : isAwaitingReview || isReviewed || justSent ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-canvas/45 p-4 text-sm text-muted" aria-live="polite" role="status">
            {isReviewed
              ? "Review complete. Mission Control has processed your transmission."
              : "Transmission sent. Mission Control will review your work."}
          </div>
          {submission && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Your code</h3>
                <pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-canvas p-4 font-mono text-sm leading-6 text-foreground">
                  <code>{submission.codeSnippet}</code>
                </pre>
              </div>
              {submission.reflection && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{reflectionPrompt}</h3>
                  <p className="mt-2 rounded-xl border border-border bg-canvas/45 p-4 text-sm leading-6 text-secondary">
                    {submission.reflection}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField
            label={needsRevision ? "Revised code" : "Homework code"}
            htmlFor="code-snippet"
            hint="Your formatting stays intact. You can scroll through longer code."
            error={error && error.toLowerCase().includes("code") ? error : undefined}
            required
          >
            <Textarea
              id="code-snippet"
              value={codeSnippet}
              onChange={(event) => { setCodeSnippet(event.target.value); setError(""); }}
              rows={10}
              spellCheck={false}
              className="min-h-48 resize-y font-mono text-sm leading-6"
              placeholder={'print("Signal online")'}
              aria-invalid={Boolean(error)}
            />
          </FormField>
          <FormField
            label={reflectionPrompt}
            htmlFor="reflection"
            hint="One or two honest sentences are perfect."
            error={error && error.toLowerCase().includes("reflection") ? error : undefined}
            required
          >
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(event) => { setReflection(event.target.value); setError(""); }}
              rows={3}
              className="min-h-20 resize-y text-sm leading-6"
              placeholder="I picked this line because…"
            />
          </FormField>
          {error && !error.toLowerCase().includes("code") && !error.toLowerCase().includes("reflection") && (
            <p className="text-sm font-semibold text-danger" role="alert">{error}</p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {needsRevision
                ? "Update your code, then resend to Mission Control."
                : user.id
                  ? "Your draft is saved on this device until you send it."
                  : "Ready to send your code to Mission Control."}
            </p>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending…" : needsRevision ? "Resend transmission" : "Send transmission"}
            </Button>
          </div>
        </form>
      )}
    </Panel>
  );
}
