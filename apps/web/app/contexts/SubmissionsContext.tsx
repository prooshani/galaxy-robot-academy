"use client";

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Submission } from "@galaxy/types";
import { submissions as initialSubmissions } from "@/lib/sampleSubmissions";
import { applySubmissionReview } from "@/lib/teacherReview";

const SUBMISSIONS_STORAGE_KEY = "gra_submissionsState";
type SubmissionStatus = Submission["status"];

const VALID_SUBMISSION_STATUSES: SubmissionStatus[] = [
  "submitted",
  "reviewed",
  "needs_revision",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSubmissionStatus(value: unknown): value is SubmissionStatus {
  return (
    typeof value === "string" &&
    VALID_SUBMISSION_STATUSES.includes(value as SubmissionStatus)
  );
}

function parseSubmission(value: unknown): Submission | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.submissionId !== "string" ||
    typeof value.missionId !== "string" ||
    typeof value.userId !== "string" ||
    typeof value.codeSnippet !== "string" ||
    typeof value.timestamp !== "string" ||
    !isSubmissionStatus(value.status) ||
    typeof value.geAwarded !== "number" ||
    (value.feedback !== undefined && typeof value.feedback !== "string")
  ) {
    return null;
  }

  return {
    submissionId: value.submissionId,
    missionId: value.missionId,
    userId: value.userId,
    codeSnippet: value.codeSnippet,
    timestamp: value.timestamp,
    status: value.status,
    geAwarded: value.geAwarded,
    feedback: value.feedback,
  };
}

function parseStoredSubmissions(value: unknown): Submission[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const parsedSubmissions: Submission[] = [];
  for (const submission of value) {
    const parsedSubmission = parseSubmission(submission);
    if (!parsedSubmission) {
      return null;
    }
    parsedSubmissions.push(parsedSubmission);
  }

  return parsedSubmissions;
}

function clearStoredSubmissions(): void {
  try {
    window.localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
  } catch {
    // Ignore cleanup failures and fall back to sample data.
  }
}

function loadInitialSubmissions(): Submission[] {
  if (typeof window === "undefined") {
    return initialSubmissions;
  }

  try {
    const storedSubmissions = window.localStorage.getItem(
      SUBMISSIONS_STORAGE_KEY
    );
    if (!storedSubmissions) {
      return initialSubmissions;
    }

    const parsedSubmissions = parseStoredSubmissions(
      JSON.parse(storedSubmissions) as unknown
    );
    if (parsedSubmissions) {
      return parsedSubmissions;
    }

    clearStoredSubmissions();
  } catch {
    clearStoredSubmissions();
  }

  return initialSubmissions;
}

interface AddSubmissionInput {
  missionId: string;
  userId: string;
  codeSnippet: string;
}

interface ReviewSubmissionInput {
  submissionId: string;
  geAwarded: number;
  feedback: string;
  status?: "reviewed" | "needs_revision";
}

interface SubmissionsContextValue {
  submissions: Submission[];
  addSubmission: (input: AddSubmissionInput) => Submission;
  reviewSubmission: (input: ReviewSubmissionInput) => void;
}

const SubmissionsContext = createContext<SubmissionsContextValue | undefined>(
  undefined
);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] =
    useState<Submission[]>(loadInitialSubmissions);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SUBMISSIONS_STORAGE_KEY,
        JSON.stringify(submissions)
      );
    } catch {
      // Ignore storage failures so context state remains usable.
    }
  }, [submissions]);

  const addSubmission = (input: AddSubmissionInput) => {
    const submission: Submission = {
      submissionId: `submission-${Date.now()}`,
      missionId: input.missionId,
      userId: input.userId,
      codeSnippet: input.codeSnippet,
      timestamp: new Date().toISOString(),
      status: "submitted",
      geAwarded: 0,
    };

    setSubmissions((currentSubmissions) => [
      submission,
      ...currentSubmissions,
    ]);

    return submission;
  };

  const reviewSubmission = (input: ReviewSubmissionInput) => {
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.submissionId === input.submissionId
          ? applySubmissionReview(submission, {
              status: input.status ?? "reviewed",
              geAwarded: input.geAwarded,
              feedback: input.feedback,
            })
          : submission
      )
    );
  };

  const value = useMemo(
    () => ({ submissions, addSubmission, reviewSubmission }),
    [submissions]
  );

  return (
    <SubmissionsContext.Provider value={value}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);

  if (!context) {
    throw new Error("useSubmissions must be used within a SubmissionsProvider");
  }

  return context;
}
