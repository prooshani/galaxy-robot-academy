"use client";

import { useState, type FormEvent } from "react";
import { Button, FormField, Panel, StatusChip, Textarea } from "@galaxy/ui";
import type { Submission } from "@galaxy/types";
import { useSubmissions } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { getSubmissionError } from "@/lib/missionExperience";

interface MissionSubmissionFormProps {
  missionId: string;
  submission?: Submission;
  instructions?: string;
}

export function MissionSubmissionForm({
  missionId,
  submission,
  instructions,
}: MissionSubmissionFormProps) {
  const { addSubmission } = useSubmissions();
  const { user, setMissionStatus } = useUser();
  const [codeSnippet, setCodeSnippet] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isAwaitingReview = submission?.status === "submitted";
  const needsRevision = submission?.status === "needs_revision";
  const isReviewed = submission?.status === "reviewed";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submissionError = getSubmissionError(codeSnippet);
    if (submissionError) {
      setError(submissionError);
      return;
    }

    addSubmission({ missionId, userId: user.id, codeSnippet: codeSnippet.trim() });
    setMissionStatus(missionId, "submitted");
    setSubmitted(true);
    setError("");
    setCodeSnippet("");
  };

  return (
    <Panel className="scroll-mt-6 border-brand/35" aria-labelledby="submission-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Code bench</p>
          <h2 id="submission-heading" className="mt-1 font-display text-2xl font-bold text-foreground">Send transmission</h2>
        </div>
        {isAwaitingReview && <StatusChip tone="submitted">Awaiting review</StatusChip>}
        {needsRevision && <StatusChip tone="warning">Needs another scan</StatusChip>}
        {isReviewed && <StatusChip tone="success">Review complete</StatusChip>}
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        {instructions ?? "Paste your mission code here. This sends code to Mission Control; it does not run code."}
      </p>

      {submission?.feedback && (
        <aside className="mt-5 rounded-xl border border-warning/35 bg-warning/10 p-4" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-warning">Transmission from Mission Control</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{submission.feedback}</p>
          {submission.geAwarded > 0 && <p className="mt-2 text-sm font-semibold text-energy">{submission.geAwarded} GE awarded</p>}
        </aside>
      )}

      {isAwaitingReview || isReviewed ? (
        <div className="mt-6 rounded-xl border border-border bg-canvas/45 p-4 text-sm text-muted" aria-live="polite">
          {isReviewed ? "Review complete. Mission Control has processed your transmission." : "Transmission sent. Mission Control will review your work."}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField
            label={needsRevision ? "Revised code" : "Mission code"}
            htmlFor="code-snippet"
            hint="Your formatting stays intact. You can scroll through longer code."
            error={error || undefined}
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
              aria-describedby={undefined}
            />
          </FormField>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Ready to send your code to Mission Control.</p>
            <Button type="submit">Send transmission</Button>
          </div>
          {submitted && <p className="text-sm font-semibold text-success" role="status">Transmission sent. Awaiting review.</p>}
        </form>
      )}
    </Panel>
  );
}
