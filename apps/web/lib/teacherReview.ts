import type { Submission } from "@galaxy/types";

export function canReviewSubmission(submission: Pick<Submission, "status">): boolean {
  return submission.status !== "reviewed";
}

export function applySubmissionReview(
  submission: Submission,
  input: { geAwarded: number; feedback: string; status: "reviewed" | "needs_revision" }
): Submission {
  if (!canReviewSubmission(submission)) {
    return submission;
  }

  return {
    ...submission,
    status: input.status,
    geAwarded: input.status === "reviewed" ? input.geAwarded : 0,
    feedback: input.feedback,
  };
}
