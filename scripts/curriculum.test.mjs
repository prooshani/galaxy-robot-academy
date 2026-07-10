import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

test("canonical curriculum passes structural validation", () => {
  const output = execFileSync(process.execPath, ["scripts/validate-curriculum.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.match(output, /All validation checks passed/);
});
