import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function loadReviewResults() {
  const output = execFileSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", `import { applySubmissionReview } from "./apps/web/lib/teacherReview.ts";
const base = { submissionId: "s1", missionId: "m1", userId: "u1", codeSnippet: "print(1)", timestamp: "2026-07-11T00:00:00.000Z", status: "submitted", geAwarded: 0 };
const reviewed = applySubmissionReview(base, { status: "reviewed", geAwarded: 50, feedback: "Good" });
console.log(JSON.stringify({ reviewed, duplicate: applySubmissionReview(reviewed, { status: "reviewed", geAwarded: 50, feedback: "Again" }), reversed: applySubmissionReview(reviewed, { status: "needs_revision", geAwarded: 0, feedback: "Change" }), revision: applySubmissionReview(base, { status: "needs_revision", geAwarded: 50, feedback: "Change" }) }));`], { cwd: process.cwd(), encoding: "utf8" });
  return JSON.parse(output);
}

test("reviewed submission ignores duplicate review and status reversal", () => {
  const result = loadReviewResults();
  assert.deepEqual(result.duplicate, result.reviewed);
  assert.deepEqual(result.reversed, result.reviewed);
});

test("revision request stores feedback but awards zero GE", () => {
  const result = loadReviewResults();
  assert.equal(result.revision.status, "needs_revision");
  assert.equal(result.revision.geAwarded, 0);
  assert.equal(result.revision.feedback, "Change");
});

test("delete confirmation uses managed modal flow", () => {
  const source = readFileSync("apps/web/app/teacher/page.tsx", "utf8");
  assert.match(source, /function DeleteMissionDialog/);
  assert.match(source, /node\?\.showModal\(\)/);
  assert.match(source, /addEventListener\("cancel", cancel\)/);
  assert.match(source, /opener\?\.focus\(\)/);
  assert.match(source, /backdrop:bg-canvas\/80/);
  assert.doesNotMatch(source, /<dialog open/);
});
