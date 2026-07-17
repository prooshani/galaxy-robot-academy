/**
 * Homework submission state machine + award idempotency.
 *
 * Pure functions used by the submissions API. No React, no Firebase —
 * unit-testable with node --test.
 */

import type { Submission } from "@galaxy/types";

export type ReviewAction = "approve" | "approve_excellent" | "request_revision";

/** Teacher GE awards on approval must stay within this range. */
export const GE_AWARD_MIN = 1;
export const GE_AWARD_MAX = 100;

/**
 * Deterministic submission document ID: one active submission per
 * (student, mission) pair, enforced atomically by document existence.
 * Callers must pass the normalized stable mission ID (see legacyIds.ts) so
 * legacy and stable IDs derive the same document.
 */
export function submissionDocId(uid: string, missionId: string): string {
  return `${uid}_${missionId}`;
}

/** A student may create a submission only when none exists for the mission. */
export function canCreateSubmission(existing: Pick<Submission, "status"> | undefined): boolean {
  return existing === undefined;
}

/** A student may resubmit only after a revision request. */
export function canResubmit(submission: Pick<Submission, "status">): boolean {
  return submission.status === "needs_revision";
}

/** A teacher may review anything that is not already approved. */
export function canReview(submission: Pick<Submission, "status">): boolean {
  return submission.status !== "reviewed";
}

export interface ReviewInput {
  action: ReviewAction;
  feedback: string;
  geAward: number;
}

export interface ReviewOutcome {
  submission: Submission;
  /** GE to add to the student's total (0 unless newly approved). */
  geDelta: number;
  /** Badges to add to the student's profile (empty unless newly approved). */
  badgeIdsToAward: string[];
}

/**
 * Apply a teacher review. Awards are idempotent by construction:
 * - an approved submission can never be reviewed again (`canReview`);
 * - GE is granted only while `geAwarded` is still 0;
 * - badges are granted only if not already recorded on the submission.
 * A revision request never awards and never removes earned GE.
 */
export function applyReview(
  submission: Submission,
  input: ReviewInput,
  missionBadgeIds: string[],
): ReviewOutcome {
  if (!canReview(submission)) {
    return { submission, geDelta: 0, badgeIdsToAward: [] };
  }

  if (input.action === "request_revision") {
    return {
      submission: {
        ...submission,
        status: "needs_revision",
        feedback: input.feedback,
      },
      geDelta: 0,
      badgeIdsToAward: [],
    };
  }

  const geDelta = submission.geAwarded > 0 ? 0 : Math.max(0, input.geAward);
  const alreadyAwarded = new Set(submission.badgeAwardedIds ?? []);
  const badgeIdsToAward = missionBadgeIds.filter((id) => !alreadyAwarded.has(id));

  return {
    submission: {
      ...submission,
      status: "reviewed",
      feedback: input.feedback,
      geAwarded: submission.geAwarded > 0 ? submission.geAwarded : geDelta,
      badgeAwardedIds: [...(submission.badgeAwardedIds ?? []), ...badgeIdsToAward],
      excellent: input.action === "approve_excellent",
    },
    geDelta,
    badgeIdsToAward,
  };
}

/** Apply a student resubmission after a revision request. */
export function applyResubmission(
  submission: Submission,
  input: { codeSnippet: string; reflection?: string },
  resubmittedAt: string,
): Submission {
  return {
    ...submission,
    codeSnippet: input.codeSnippet,
    reflection: input.reflection ?? submission.reflection,
    status: "submitted",
    resubmissionCount: (submission.resubmissionCount ?? 0) + 1,
    timestamp: resubmittedAt,
  };
}

/** Validate the code field of a submission. */
export function getSubmissionCodeError(code: string): string | undefined {
  return code.trim() ? undefined : "Add your code before sending your transmission.";
}

/** Validate the reflection field of a submission. */
export function getSubmissionReflectionError(reflection: string): string | undefined {
  return reflection.trim() ? undefined : "Answer the reflection question before sending.";
}
