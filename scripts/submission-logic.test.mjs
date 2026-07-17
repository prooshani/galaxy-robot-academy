import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

function run(script) {
  const output = execFileSync(
    process.execPath,
    ["--experimental-strip-types", "--input-type=module", "-e", script],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  return JSON.parse(output);
}

const BASE = `const base = {
  submissionId: "s1",
  missionId: "mission-01",
  userId: "student-a",
  codeSnippet: 'print("hi")',
  reflection: "I liked line one.",
  timestamp: "2026-07-13T00:00:00.000Z",
  status: "submitted",
  geAwarded: 0,
  badgeAwardedIds: [],
  resubmissionCount: 0,
};`;

test("submission creation is blocked while any submission exists", () => {
  const result = run(`import { canCreateSubmission, canResubmit, canReview } from "./apps/web/lib/submissionLogic.ts";
console.log(JSON.stringify({
  fresh: canCreateSubmission(undefined),
  whileSubmitted: canCreateSubmission({ status: "submitted" }),
  whileRevision: canCreateSubmission({ status: "needs_revision" }),
  whileReviewed: canCreateSubmission({ status: "reviewed" }),
  resubmitSubmitted: canResubmit({ status: "submitted" }),
  resubmitRevision: canResubmit({ status: "needs_revision" }),
  resubmitReviewed: canResubmit({ status: "reviewed" }),
  reviewSubmitted: canReview({ status: "submitted" }),
  reviewReviewed: canReview({ status: "reviewed" }),
}));`);
  assert.equal(result.fresh, true);
  assert.equal(result.whileSubmitted, false);
  assert.equal(result.whileRevision, false);
  assert.equal(result.whileReviewed, false);
  assert.equal(result.resubmitRevision, true);
  assert.equal(result.resubmitSubmitted, false);
  assert.equal(result.resubmitReviewed, false);
  assert.equal(result.reviewSubmitted, true);
  assert.equal(result.reviewReviewed, false);
});

test("approve awards GE and badges exactly once; re-review is a no-op", () => {
  const result = run(`import { applyReview } from "./apps/web/lib/submissionLogic.ts";
${BASE}
const approved = applyReview(base, { action: "approve", feedback: "Nice", geAward: 40 }, ["first-contact"]);
const again = applyReview(approved.submission, { action: "approve", feedback: "Again", geAward: 40 }, ["first-contact"]);
const excellent = applyReview(base, { action: "approve_excellent", feedback: "Wow", geAward: 45 }, ["first-contact"]);
console.log(JSON.stringify({ approved, again, excellent }));`);
  assert.equal(result.approved.submission.status, "reviewed");
  assert.equal(result.approved.geDelta, 40);
  assert.equal(result.approved.submission.geAwarded, 40);
  assert.deepEqual(result.approved.badgeIdsToAward, ["first-contact"]);
  assert.equal(result.approved.submission.excellent, false);

  // A locked submission yields zero awards on any later review attempt.
  assert.equal(result.again.geDelta, 0);
  assert.deepEqual(result.again.badgeIdsToAward, []);
  assert.equal(result.again.submission.geAwarded, 40);

  assert.equal(result.excellent.submission.excellent, true);
  assert.equal(result.excellent.geDelta, 45);
});

test("revision request awards nothing and resubmission returns to review queue", () => {
  const result = run(`import { applyReview, applyResubmission } from "./apps/web/lib/submissionLogic.ts";
${BASE}
const revision = applyReview(base, { action: "request_revision", feedback: "Check quotes", geAward: 40 }, ["first-contact"]);
const resubmitted = applyResubmission(revision.submission, { codeSnippet: 'print("fixed")', reflection: "Updated." }, "2026-07-14T00:00:00.000Z");
const approvedAfter = applyReview(resubmitted, { action: "approve", feedback: "Great fix", geAward: 40 }, ["first-contact"]);
console.log(JSON.stringify({ revision, resubmitted, approvedAfter }));`);
  assert.equal(result.revision.submission.status, "needs_revision");
  assert.equal(result.revision.geDelta, 0);
  assert.deepEqual(result.revision.badgeIdsToAward, []);
  assert.equal(result.revision.submission.feedback, "Check quotes");

  assert.equal(result.resubmitted.status, "submitted");
  assert.equal(result.resubmitted.codeSnippet, 'print("fixed")');
  assert.equal(result.resubmitted.reflection, "Updated.");
  assert.equal(result.resubmitted.resubmissionCount, 1);
  assert.equal(result.resubmitted.timestamp, "2026-07-14T00:00:00.000Z");

  // The full revise → resubmit → approve loop still awards exactly once.
  assert.equal(result.approvedAfter.geDelta, 40);
  assert.deepEqual(result.approvedAfter.badgeIdsToAward, ["first-contact"]);
});

test("mission unlock sequence follows session order for the new stable IDs", () => {
  const result = run(`import { getNextAvailableMission } from "./apps/web/lib/missionExperience.ts";
const canonical = [
  { missionId: "mission-01", sessionNumber: 1 },
  { missionId: "mission-02", sessionNumber: 2 },
  { missionId: "mission-03", sessionNumber: 3 },
  { missionId: "mission-04", sessionNumber: 4 },
  { missionId: "mission-5", sessionNumber: 5 },
];
console.log(JSON.stringify({
  after01: getNextAvailableMission(canonical, canonical, "mission-01"),
  after04: getNextAvailableMission(canonical, canonical, "mission-04"),
  after5: getNextAvailableMission(canonical, canonical, "mission-5"),
}));`);
  assert.equal(result.after01.missionId, "mission-02");
  assert.equal(result.after04.missionId, "mission-5");
  assert.equal(result.after5, undefined);
});

test("submission doc IDs are deterministic per (student, mission) with normalized mission IDs", () => {
  const result = run(`import { submissionDocId, GE_AWARD_MIN, GE_AWARD_MAX } from "./apps/web/lib/submissionLogic.ts";
import { normalizeMissionId } from "./apps/web/lib/legacyIds.ts";
console.log(JSON.stringify({
  stable: submissionDocId("uid-a", normalizeMissionId("mission-01")),
  legacy: submissionDocId("uid-a", normalizeMissionId("mission-1")),
  other: submissionDocId("uid-b", normalizeMissionId("mission-01")),
  unpadded: submissionDocId("uid-a", normalizeMissionId("mission-5")),
  min: GE_AWARD_MIN,
  max: GE_AWARD_MAX,
}));`);
  assert.equal(result.stable, "uid-a_mission-01");
  // Legacy and stable IDs derive the SAME doc id — one active submission per pair.
  assert.equal(result.legacy, result.stable);
  assert.notEqual(result.other, result.stable);
  assert.equal(result.unpadded, "uid-a_mission-5");
  assert.equal(result.min, 1);
  assert.equal(result.max, 100);
});

test("reflection and code validation reject empty values", () => {
  const result = run(`import { getSubmissionCodeError, getSubmissionReflectionError } from "./apps/web/lib/submissionLogic.ts";
console.log(JSON.stringify({
  emptyReflection: getSubmissionReflectionError("") ?? null,
  whitespaceReflection: getSubmissionReflectionError("   ") ?? null,
  okReflection: getSubmissionReflectionError("I liked it.") ?? null,
  emptyCode: getSubmissionCodeError("") ?? null,
  okCode: getSubmissionCodeError("print(1)") ?? null,
}));`);
  assert.notEqual(result.emptyReflection, null);
  assert.notEqual(result.whitespaceReflection, null);
  assert.equal(result.okReflection, null);
  assert.notEqual(result.emptyCode, null);
  assert.equal(result.okCode, null);
});

test("legacy IDs migrate to the approved stable IDs", () => {
  const result = run(`import { normalizeMissionId, normalizeBadgeId } from "./apps/web/lib/legacyIds.ts";
console.log(JSON.stringify({
  mission: normalizeMissionId("mission-1"),
  missionNew: normalizeMissionId("mission-01"),
  mission5: normalizeMissionId("mission-5"),
  badge: normalizeBadgeId("badge-start"),
  logic: normalizeBadgeId("badge-logic"),
  unknownBadge: normalizeBadgeId("badge-final"),
}));`);
  assert.equal(result.mission, "mission-01");
  assert.equal(result.missionNew, "mission-01");
  assert.equal(result.mission5, "mission-5");
  assert.equal(result.badge, "first-contact");
  assert.equal(result.logic, "logic-navigator");
  assert.equal(result.unknownBadge, "badge-final");
});
