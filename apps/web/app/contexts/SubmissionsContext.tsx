"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Submission } from "@galaxy/types";
import type { ReviewAction } from "@/lib/submissionLogic";
import { useUser } from "@/app/contexts/UserContext";

// Submissions are Firestore-backed through the server API. Students receive
// only their own submissions; teachers/admins receive everything (enriched
// with student names + quiz progress). localStorage is never canonical.

interface AddSubmissionInput {
  missionId: string;
  codeSnippet: string;
  reflection: string;
}

interface ResubmitInput {
  submissionId: string;
  codeSnippet: string;
  reflection?: string;
}

interface ReviewSubmissionInput {
  submissionId: string;
  action: ReviewAction;
  feedback: string;
  geAward: number;
}

export interface SubmissionActionResult {
  ok: boolean;
  error?: string;
  submission?: Submission;
}

interface SubmissionsContextValue {
  submissions: Submission[];
  /** "loading" until the first fetch resolves for an authed user. */
  status: "idle" | "loading" | "ready" | "error";
  addSubmission: (input: AddSubmissionInput) => Promise<SubmissionActionResult>;
  resubmitSubmission: (input: ResubmitInput) => Promise<SubmissionActionResult>;
  reviewSubmission: (input: ReviewSubmissionInput) => Promise<SubmissionActionResult>;
  refreshSubmissions: () => Promise<void>;
}

const SubmissionsContext = createContext<SubmissionsContextValue | undefined>(undefined);

async function parseResult(res: Response): Promise<SubmissionActionResult> {
  const data = (await res.json().catch(() => null)) as
    | { submission?: Submission; error?: string }
    | null;
  if (!res.ok) {
    return { ok: false, error: data?.error ?? "Transmission failed. Try again." };
  }
  return { ok: true, submission: data?.submission };
}

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const { authStatus } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<SubmissionsContextValue["status"]>("idle");

  const refreshSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = (await res.json()) as { submissions?: Submission[] };
      setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (authStatus === "authed") {
      setStatus("loading");
      void refreshSubmissions();
    } else if (authStatus === "anon") {
      setSubmissions([]);
      setStatus("ready");
    }
  }, [authStatus, refreshSubmissions]);

  const addSubmission = useCallback(
    async (input: AddSubmissionInput): Promise<SubmissionActionResult> => {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }).catch(() => null);
      if (!res) return { ok: false, error: "Network error. Check your connection and retry." };
      const result = await parseResult(res);
      if (result.ok && result.submission) {
        const created = result.submission;
        setSubmissions((current) => [created, ...current]);
      }
      return result;
    },
    [],
  );

  const resubmitSubmission = useCallback(
    async (input: ResubmitInput): Promise<SubmissionActionResult> => {
      const res = await fetch(`/api/submissions/${input.submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resubmit: true,
          codeSnippet: input.codeSnippet,
          reflection: input.reflection,
        }),
      }).catch(() => null);
      if (!res) return { ok: false, error: "Network error. Check your connection and retry." };
      const result = await parseResult(res);
      if (result.ok && result.submission) {
        const updated = result.submission;
        setSubmissions((current) =>
          current.map((s) => (s.submissionId === updated.submissionId ? { ...s, ...updated } : s)),
        );
      }
      return result;
    },
    [],
  );

  const reviewSubmission = useCallback(
    async (input: ReviewSubmissionInput): Promise<SubmissionActionResult> => {
      const res = await fetch(`/api/submissions/${input.submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: input.action,
          feedback: input.feedback,
          geAward: input.geAward,
        }),
      }).catch(() => null);
      if (!res) return { ok: false, error: "Network error. Check your connection and retry." };
      const result = await parseResult(res);
      if (result.ok && result.submission) {
        const updated = result.submission;
        setSubmissions((current) =>
          current.map((s) => (s.submissionId === updated.submissionId ? { ...s, ...updated } : s)),
        );
      }
      return result;
    },
    [],
  );

  const value = useMemo(
    () => ({ submissions, status, addSubmission, resubmitSubmission, reviewSubmission, refreshSubmissions }),
    [submissions, status, addSubmission, resubmitSubmission, reviewSubmission, refreshSubmissions],
  );

  return <SubmissionsContext.Provider value={value}>{children}</SubmissionsContext.Provider>;
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);

  if (!context) {
    throw new Error("useSubmissions must be used within a SubmissionsProvider");
  }

  return context;
}
