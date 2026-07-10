#!/usr/bin/env node
/**
 * Curriculum validation script.
 *
 * Runs structural checks on the academy/ directory to catch data issues
 * before typecheck and build. Uses only Node.js stdlib — no external deps.
 *
 * Exit code 0 = all checks pass. Non-zero = validation failed.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let failures = 0;
const errors = [];

function check(condition, message) {
  if (!condition) {
    failures++;
    errors.push(message);
  }
}

// ─── 1. Directory structure ───────────────────────────────────────────
console.log("📁 Checking directory structure...");

const missionsDir = join(ROOT, "academy", "missions");
const badgesDir = join(ROOT, "academy", "badges");
const homeworkDir = join(ROOT, "academy", "homework");
const curriculumDir = join(ROOT, "academy", "curriculum");

check(
  statSync(missionsDir).isDirectory(),
  "academy/missions/ directory must exist"
);
check(
  statSync(badgesDir).isDirectory(),
  "academy/badges/ directory must exist"
);
check(
  statSync(homeworkDir).isDirectory(),
  "academy/homework/ directory must exist"
);
check(
  statSync(curriculumDir).isDirectory(),
  "academy/curriculum/ directory must exist"
);

// ─── 2. Mission file count ────────────────────────────────────────────
console.log("📝 Checking mission files...");

const missionFiles = readdirSync(missionsDir).filter(
  (f) => f.endsWith(".ts") && f !== "index.ts"
);
check(
  missionFiles.length === 12,
  `Expected 12 mission files, found ${missionFiles.length}`
);

// ─── 3. Parse mission files and collect IDs ───────────────────────────
console.log("🔍 Parsing mission definitions...");

const missionIds = new Set();
const badgeIdsInMissions = new Set();

for (const file of missionFiles) {
  const content = readFileSync(join(missionsDir, file), "utf-8");

  // Extract missionId
  const missionIdMatch = content.match(/missionId:\s*"([^"]+)"/);
  check(
    missionIdMatch,
    `Mission file ${file} missing missionId`
  );
  if (missionIdMatch) {
    const id = missionIdMatch[1];
    check(
      !missionIds.has(id),
      `Duplicate missionId "${id}" in ${file}`
    );
    missionIds.add(id);
  }

  // Extract badgeIds
  const badgeIdsMatch = content.match(/badgeIds:\s*\[([^\]]+)\]/);
  if (badgeIdsMatch) {
    const badges = badgeIdsMatch[1].match(/"([^"]+)"/g);
    if (badges) {
      for (const b of badges) {
        badgeIdsInMissions.add(b.replace(/"/g, ""));
      }
    }
  }

  // Check no as const on export
  check(
    !content.includes("as const"),
    `Mission file ${file} should not contain "as const"`
  );
}

// ─── 4. Parse badges ──────────────────────────────────────────────────
console.log("🏅 Checking badge definitions...");

const badgesContent = readFileSync(
  join(badgesDir, "index.ts"),
  "utf-8"
);

const badgeIdMatches = badgesContent.match(/badgeId:\s*"([^"]+)"/g) || [];
const badgeIdsSet = new Set(
  badgeIdMatches.map((m) => m.replace(/badgeId:\s*"/, "").replace(/"/, ""))
);

check(
  badgeIdMatches.length === 13,
  `Expected 13 badges, found ${badgeIdMatches.length}`
);

// Check no as const on barrel array
check(
  !badgesContent.includes("as const"),
  "academy/badges/index.ts should not contain 'as const'"
);

// ─── 5. Validate badge references ─────────────────────────────────────
console.log("🔗 Validating badge references...");

for (const badgeId of badgeIdsInMissions) {
  check(
    badgeIdsSet.has(badgeId),
    `Badge "${badgeId}" referenced in missions but not defined in academy/badges/`
  );
}

// ─── 6. Parse homework ────────────────────────────────────────────────
console.log("📚 Checking homework definitions...");

const homeworkContent = readFileSync(
  join(homeworkDir, "index.ts"),
  "utf-8"
);

const homeworkMissionIds = homeworkContent.match(
  /missionId:\s*"([^"]+)"/g
) || [];
const homeworkMissionIdSet = new Set(
  homeworkMissionIds.map(
    (m) => m.replace(/missionId:\s*"/, "").replace(/"/, "")
  )
);

check(
  homeworkMissionIds.length === 12,
  `Expected 12 homework items, found ${homeworkMissionIds.length}`
);

// Check no as const on barrel array
check(
  !homeworkContent.includes("as const"),
  "academy/homework/index.ts should not contain 'as const'"
);

// ─── 7. Validate homework → mission references ────────────────────────
console.log("🔗 Validating homework references...");

for (const hwId of homeworkMissionIdSet) {
  check(
    missionIds.has(hwId),
    `Homework missionId "${hwId}" not found in academy/missions/`
  );
}

// ─── 8. Parse course manifest ─────────────────────────────────────────
console.log("📖 Checking course manifest...");

const curriculumContent = readFileSync(
  join(curriculumDir, "galaxy-robot-academy.ts"),
  "utf-8"
);

// Check required fields exist
check(
  /courseId:\s*"/.test(curriculumContent),
  "Course manifest missing courseId"
);
check(
  /slug:\s*"/.test(curriculumContent),
  "Course manifest missing slug"
);
check(
  /title:\s*"/.test(curriculumContent),
  "Course manifest missing title"
);
check(
  /subtitle:\s*"/.test(curriculumContent),
  "Course manifest missing subtitle"
);
check(
  /description:\s*"/.test(curriculumContent),
  "Course manifest missing description"
);
check(
  /targetAgeMin:\s*\d+/.test(curriculumContent),
  "Course manifest missing targetAgeMin"
);
check(
  /targetAgeMax:\s*\d+/.test(curriculumContent),
  "Course manifest missing targetAgeMax"
);
check(
  /estimatedWeeks:\s*\d+/.test(curriculumContent),
  "Course manifest missing estimatedWeeks"
);
check(
  /sessionsPerWeek:\s*\d+/.test(curriculumContent),
  "Course manifest missing sessionsPerWeek"
);
check(
  /totalSessions:\s*\d+/.test(curriculumContent),
  "Course manifest missing totalSessions"
);
check(
  /missionIds:\s*\[/.test(curriculumContent),
  "Course manifest missing missionIds"
);
check(
  /finalProjectMissionId:\s*"/.test(curriculumContent),
  "Course manifest missing finalProjectMissionId"
);
check(
  /version:\s*\d+/.test(curriculumContent),
  "Course manifest missing version"
);

// Check no as const
check(
  !curriculumContent.includes("as const"),
  "academy/curriculum/galaxy-robot-academy.ts should not contain 'as const'"
);

// ─── 9. Validate missionIds in course manifest ────────────────────────
console.log("🔗 Validating course manifest references...");

const manifestMissionIds =
  curriculumContent.match(/missionIds:\s*\[([^\]]+)\]/)?.[1]?.match(
    /"([^"]+)"/g
  ) || [];
const manifestMissionIdSet = new Set(
  manifestMissionIds.map((m) => m.replace(/"/g, ""))
);

for (const id of manifestMissionIdSet) {
  check(
    missionIds.has(id),
    `Course manifest missionId "${id}" not found in academy/missions/`
  );
}

// ─── 10. Check barrel exports ─────────────────────────────────────────
console.log("📦 Checking barrel exports...");

const missionsIndex = readFileSync(
  join(missionsDir, "index.ts"),
  "utf-8"
);
check(
  /export\s+\{/.test(missionsIndex) && /mission1/.test(missionsIndex),
  "academy/missions/index.ts should export individual missions"
);
check(
  /export\s+const\s+academyMissions/.test(missionsIndex),
  "academy/missions/index.ts should export academyMissions"
);

const badgesIndex = readFileSync(
  join(badgesDir, "index.ts"),
  "utf-8"
);
check(
  /export\s+const\s+academyBadges/.test(badgesIndex),
  "academy/badges/index.ts should export academyBadges"
);

const homeworkIndex = readFileSync(
  join(homeworkDir, "index.ts"),
  "utf-8"
);
check(
  /export\s+const\s+academyHomework/.test(homeworkIndex),
  "academy/homework/index.ts should export academyHomework"
);

// ─── Summary ──────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(50));
if (failures === 0) {
  console.log("✅ All validation checks passed!");
  console.log("=".repeat(50));
  process.exit(0);
} else {
  console.log(`❌ ${failures} validation check(s) failed:`);
  for (const err of errors) {
    console.log(`  • ${err}`);
  }
  console.log("=".repeat(50));
  process.exit(1);
}
