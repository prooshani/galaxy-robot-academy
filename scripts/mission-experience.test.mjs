import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

function loadMissionExperience() {
  const output = execFileSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--input-type=module",
      "-e",
      `import * as experience from "./apps/web/lib/missionExperience.ts"; console.log(JSON.stringify({
        next: experience.getNextAvailableMission(
          [{ missionId: "mission-1", sessionNumber: 1 }, { missionId: "mission-2", sessionNumber: 2 }, { missionId: "mission-12", sessionNumber: 12 }],
          [{ missionId: "mission-1", sessionNumber: 1 }, { missionId: "mission-12", sessionNumber: 12 }],
          "mission-12"
        ),
        availableNext: experience.getNextAvailableMission(
          [{ missionId: "mission-1", sessionNumber: 1 }, { missionId: "mission-2", sessionNumber: 2 }, { missionId: "mission-12", sessionNumber: 12 }],
          [{ missionId: "mission-1", sessionNumber: 1 }, { missionId: "mission-2", sessionNumber: 2 }, { missionId: "mission-12", sessionNumber: 12 }],
          "mission-1"
        ),
        emptySubmission: experience.getSubmissionError("   "),
        validSubmission: experience.getSubmissionError("print(1)")
      }));`,
    ],
    { cwd: process.cwd(), encoding: "utf8" }
  );

  return JSON.parse(output);
}

test("final canonical mission has no next navigation target", () => {
  const result = loadMissionExperience();

  assert.equal(result.next, undefined);
  assert.deepEqual(result.availableNext, { missionId: "mission-2", sessionNumber: 2 });
});

test("submission validation only rejects empty code", () => {
  const result = loadMissionExperience();

  assert.equal(result.emptySubmission, "Add your code before sending your transmission.");
  assert.equal(result.validSubmission, undefined);
});
