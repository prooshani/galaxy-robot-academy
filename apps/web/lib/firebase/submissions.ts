import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getRankByGE } from "@galaxy/config";
import type { QuizProgress, Submission, UserRole } from "@galaxy/types";
import { adminDb } from "./admin";
import { getMissionById, normalizeMissionId } from "../academyContent";
import { getQuizByMissionId } from "../serverQuizzes";
import {
  applyResubmission,
  applyReview,
  canCreateSubmission,
  canResubmit,
  canReview,
  submissionDocId,
  type ReviewInput,
} from "../submissionLogic";

const SUBMISSIONS = "submissions";
const STUDENTS = "students";

function toSubmission(id: string, data: Record<string, unknown>): Submission {
  return {
    submissionId: id,
    missionId: (data.missionId as string) ?? "",
    userId: (data.userId as string) ?? "",
    codeSnippet: (data.codeSnippet as string) ?? "",
    timestamp: (data.timestamp as string) ?? "",
    status: (data.status as Submission["status"]) ?? "submitted",
    geAwarded: (data.geAwarded as number) ?? 0,
    feedback: (data.feedback as string | undefined) ?? undefined,
    homeworkId: (data.homeworkId as string | undefined) ?? undefined,
    reflection: (data.reflection as string | undefined) ?? undefined,
    badgeAwardedIds: (data.badgeAwardedIds as string[] | undefined) ?? undefined,
    excellent: (data.excellent as boolean | undefined) ?? undefined,
    resubmissionCount: (data.resubmissionCount as number | undefined) ?? undefined,
  };
}

/** List the caller's own submissions (students). */
export async function listOwnSubmissions(uid: string): Promise<Submission[]> {
  const snap = await adminDb.collection(SUBMISSIONS).where("userId", "==", uid).get();
  return snap.docs
    .map((d) => toSubmission(d.id, d.data()))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * List every submission, enriched with student display names and that
 * student's quiz progress for the submission's mission (teacher view).
 */
export async function listAllSubmissions(): Promise<Submission[]> {
  const snap = await adminDb.collection(SUBMISSIONS).get();
  const submissions = snap.docs
    .map((d) => toSubmission(d.id, d.data()))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const uids = Array.from(new Set(submissions.map((s) => s.userId))).filter(Boolean);
  if (uids.length === 0) return submissions;

  const refs = uids.map((uid) => adminDb.collection(STUDENTS).doc(uid));
  const profiles = await adminDb.getAll(...refs);
  const byUid = new Map<string, Record<string, unknown>>();
  for (const doc of profiles) {
    if (doc.exists) byUid.set(doc.id, doc.data() ?? {});
  }

  return submissions.map((submission) => {
    const profile = byUid.get(submission.userId);
    const quiz = getQuizByMissionId(submission.missionId);
    const progress = profile?.progress as { quizzes?: Record<string, QuizProgress> } | undefined;
    return {
      ...submission,
      studentName: (profile?.displayName as string | undefined) ?? submission.userId,
      quizProgress: quiz ? progress?.quizzes?.[quiz.quizId] ?? null : null,
    };
  });
}

// Find any existing submission for a (student, mission) pair. Stored
// missionIds are normalized in code so legacy docs (mission-1) still match.
async function findByUserAndMission(uid: string, missionId: string) {
  const normalized = normalizeMissionId(missionId);
  const snap = await adminDb.collection(SUBMISSIONS).where("userId", "==", uid).get();
  return snap.docs.find((d) => normalizeMissionId((d.data().missionId as string) ?? "") === normalized);
}

/**
 * Create the student's submission for a mission. Rejects duplicates —
 * revision flows go through resubmitSubmission instead. Duplicate protection
 * is atomic: the document ID is deterministic (`${uid}_${missionId}`) and the
 * existence check + create run in one transaction, so concurrent POSTs cannot
 * create two active submissions. The pre-query additionally catches legacy
 * docs created under random IDs.
 */
export async function createSubmission(input: {
  uid: string;
  missionId: string;
  codeSnippet: string;
  reflection: string;
}): Promise<{ submission?: Submission; error?: string; status?: number }> {
  const missionId = normalizeMissionId(input.missionId);
  const mission = getMissionById(missionId);
  if (!mission) return { error: "Unknown mission", status: 400 };

  const existing = await findByUserAndMission(input.uid, missionId);
  if (!canCreateSubmission(existing ? { status: (existing.data().status as Submission["status"]) } : undefined)) {
    return { error: "A submission for this mission already exists.", status: 409 };
  }

  const now = new Date().toISOString();
  const doc = {
    missionId,
    homeworkId: mission.homeworkId ?? null,
    userId: input.uid,
    codeSnippet: input.codeSnippet,
    reflection: input.reflection,
    timestamp: now,
    status: "submitted" as const,
    geAwarded: 0,
    feedback: null,
    badgeAwardedIds: [],
    excellent: false,
    resubmissionCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  const ref = adminDb.collection(SUBMISSIONS).doc(submissionDocId(input.uid, missionId));
  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists) throw new HttpError(409, "A submission for this mission already exists.");
      tx.create(ref, doc);
    });
  } catch (err) {
    if (err instanceof HttpError) return { error: err.message, status: err.code };
    throw err;
  }
  return { submission: toSubmission(ref.id, doc) };
}

/** Student resubmits their own submission after a revision request. */
export async function resubmitSubmission(input: {
  uid: string;
  submissionId: string;
  codeSnippet: string;
  reflection?: string;
}): Promise<{ submission?: Submission; error?: string; status?: number }> {
  const ref = adminDb.collection(SUBMISSIONS).doc(input.submissionId);
  const snap = await ref.get();
  if (!snap.exists) return { error: "Submission not found", status: 404 };

  const submission = toSubmission(snap.id, snap.data() ?? {});
  if (submission.userId !== input.uid) return { error: "Forbidden", status: 403 };
  if (!canResubmit(submission)) {
    return { error: "This submission is not awaiting a revision.", status: 409 };
  }

  const updated = applyResubmission(
    submission,
    { codeSnippet: input.codeSnippet, reflection: input.reflection },
    new Date().toISOString(),
  );
  await ref.update({
    codeSnippet: updated.codeSnippet,
    reflection: updated.reflection ?? null,
    status: updated.status,
    resubmissionCount: updated.resubmissionCount,
    timestamp: updated.timestamp,
    updatedAt: updated.timestamp,
  });
  return { submission: updated };
}

/**
 * Teacher review. Runs in a transaction so GE and badge awards land exactly
 * once, even under concurrent reviews: an approved submission is locked, GE
 * is granted only while geAwarded is 0, badges only if not already recorded.
 */
export async function reviewSubmission(input: {
  reviewerRole: UserRole;
  submissionId: string;
  review: ReviewInput;
}): Promise<{ submission?: Submission; error?: string; status?: number }> {
  if (input.reviewerRole !== "teacher" && input.reviewerRole !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  const ref = adminDb.collection(SUBMISSIONS).doc(input.submissionId);

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new HttpError(404, "Submission not found");

      const submission = toSubmission(snap.id, snap.data() ?? {});
      if (!canReview(submission)) {
        throw new HttpError(409, "This submission is already approved and locked.");
      }

      const mission = getMissionById(submission.missionId);
      const outcome = applyReview(submission, input.review, mission?.badgeIds ?? []);
      const now = new Date().toISOString();

      const studentRef = adminDb.collection(STUDENTS).doc(submission.userId);
      const studentSnap = await tx.get(studentRef);

      // Never lock a submission as reviewed while silently dropping the
      // award: without a student profile the approval must fail outright.
      if (outcome.submission.status === "reviewed" && !studentSnap.exists) {
        throw new HttpError(409, "Student profile not found — the award cannot be recorded. Retry once the account exists.");
      }

      tx.update(ref, {
        status: outcome.submission.status,
        feedback: outcome.submission.feedback ?? null,
        geAwarded: outcome.submission.geAwarded,
        badgeAwardedIds: outcome.submission.badgeAwardedIds ?? [],
        excellent: outcome.submission.excellent ?? false,
        updatedAt: now,
      });

      if (studentSnap.exists && outcome.submission.status === "reviewed") {
        const data = studentSnap.data() ?? {};
        const gamification = (data.gamification ?? {}) as {
          totalGE?: number;
          badgeIds?: string[];
        };
        const totalGE = (gamification.totalGE ?? 0) + outcome.geDelta;
        const badgeIds = Array.from(
          new Set([...(gamification.badgeIds ?? []), ...outcome.badgeIdsToAward]),
        );
        tx.update(studentRef, {
          "gamification.totalGE": totalGE,
          "gamification.rankId": getRankByGE(totalGE),
          "gamification.badgeIds": badgeIds,
          "gamification.lastActivityAt": FieldValue.serverTimestamp(),
          [`progress.missionStatus.${normalizeMissionId(submission.missionId)}`]: "completed",
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      return outcome.submission;
    });
    return { submission: result };
  } catch (err) {
    if (err instanceof HttpError) return { error: err.message, status: err.code };
    throw err;
  }
}

class HttpError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}
