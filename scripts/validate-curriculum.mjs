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
const missionSlugs = new Set();
const sessionNumbers = new Set();
const orderedSessions = [];
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

  const slug = content.match(/slug:\s*"([^"]+)"/)?.[1];
  const sessionNumber = Number(content.match(/sessionNumber:\s*(\d+)/)?.[1]);
  check(Boolean(slug), `Mission file ${file} missing slug`);
  check(!slug || !missionSlugs.has(slug), `Duplicate mission slug "${slug}" in ${file}`);
  if (slug) missionSlugs.add(slug);
  check(Number.isInteger(sessionNumber), `Mission file ${file} missing valid sessionNumber`);
  check(!sessionNumbers.has(sessionNumber), `Duplicate sessionNumber ${sessionNumber} in ${file}`);
  sessionNumbers.add(sessionNumber);
  orderedSessions.push(sessionNumber);

  for (const field of ["title", "story", "objectives", "requiredTasks", "bonusTasks", "rewardGE", "badgeIds"]) {
    check(new RegExp(`${field}:\\s*`).test(content), `Mission file ${file} missing ${field}`);
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
check(
  orderedSessions.sort((a, b) => a - b).every((value, index) => value === index + 1),
  "Mission sessions must be exactly 1 through 12",
);

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
check(badgeIdsSet.size === badgeIdMatches.length, "Badge IDs must be unique");

check(
  badgeIdMatches.length === 14,
  `Expected 14 badges, found ${badgeIdMatches.length}`
);

// Approved badge IDs for Sessions 01–04 must exist.
for (const approvedBadge of ["first-contact", "memory-engineer", "signal-operator", "logic-navigator"]) {
  check(
    badgeIdsSet.has(approvedBadge),
    `Approved badge "${approvedBadge}" missing from academy/badges/`
  );
}

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
const homeworkIdMatches = homeworkContent.match(/homeworkId:\s*"([^"]+)"/g) || [];
const homeworkIds = new Set(homeworkIdMatches.map((m) => m.match(/"([^"]+)"/)?.[1]));

check(
  homeworkMissionIds.length === 12,
  `Expected 12 homework items, found ${homeworkMissionIds.length}`
);
check(homeworkIds.size === 12, "Homework IDs must be unique and total 12");
check(homeworkMissionIdSet.size === 12, "Each mission must have exactly one homework item");
const homeworkMinutes = [...homeworkContent.matchAll(/estimatedMinutes:\s*(\d+)/g)].map((match) => Number(match[1]));
check(homeworkMinutes.length === 12 && homeworkMinutes.every((minutes) => minutes <= 20), "Homework estimatedMinutes must be at most 20");

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
check(manifestMissionIds.length === 12, "Course manifest must contain exactly 12 mission IDs");
check(manifestMissionIdSet.size === 12, "Course manifest mission IDs must be unique");
const EXPECTED_MANIFEST_ORDER = [
  "mission-01",
  "mission-02",
  "mission-03",
  "mission-04",
  "mission-5",
  "mission-6",
  "mission-7",
  "mission-8",
  "mission-9",
  "mission-10",
  "mission-11",
  "mission-12",
];
check(
  manifestMissionIds.every((quotedId, index) => quotedId.replace(/"/g, "") === EXPECTED_MANIFEST_ORDER[index]),
  "Course manifest missions must follow the approved stable ID order (mission-01…mission-04, then mission-5…mission-12)",
);
const finalProjectMissionId = curriculumContent.match(/finalProjectMissionId:\s*"([^"]+)"/)?.[1];
check(finalProjectMissionId === "mission-12", "Final project must be mission-12");
check(Boolean(finalProjectMissionId && missionIds.has(finalProjectMissionId)), "Final project mission ID must resolve");

for (const id of manifestMissionIdSet) {
  check(
    missionIds.has(id),
    `Course manifest missionId "${id}" not found in academy/missions/`
  );
}

// ─── 10. Parse quizzes ────────────────────────────────────────────────
console.log("❓ Checking quiz definitions...");

const quizzesDir = join(ROOT, "academy", "quizzes");
check(statSync(quizzesDir).isDirectory(), "academy/quizzes/ directory must exist");

const quizFiles = readdirSync(quizzesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
check(quizFiles.length === 4, `Expected 4 quiz files, found ${quizFiles.length}`);

const EXPECTED_QUIZZES = {
  "quiz-01": "mission-01",
  "quiz-02": "mission-02",
  "quiz-03": "mission-03",
  "quiz-04": "mission-04",
};
const quizIds = new Set();

for (const file of quizFiles) {
  const content = readFileSync(join(quizzesDir, file), "utf-8");

  const quizId = content.match(/quizId:\s*"([^"]+)"/)?.[1];
  check(Boolean(quizId), `Quiz file ${file} missing quizId`);
  if (quizId) {
    check(!quizIds.has(quizId), `Duplicate quizId "${quizId}" in ${file}`);
    quizIds.add(quizId);
    check(quizId in EXPECTED_QUIZZES, `Unexpected quizId "${quizId}" in ${file}`);
  }

  const quizMissionId = content.match(/missionId:\s*"([^"]+)"/)?.[1];
  check(
    Boolean(quizId && quizMissionId && EXPECTED_QUIZZES[quizId] === quizMissionId),
    `Quiz ${quizId ?? file} must belong to ${quizId ? EXPECTED_QUIZZES[quizId] : "its mission"} (found ${quizMissionId})`
  );
  check(
    Boolean(quizMissionId && missionIds.has(quizMissionId)),
    `Quiz missionId "${quizMissionId}" not found in academy/missions/`
  );

  const questionCount = (content.match(/questionId:\s*"/g) || []).length;
  check(questionCount === 7, `Quiz ${quizId ?? file} must have exactly 7 questions, found ${questionCount}`);

  const passingScore = Number(content.match(/passingScore:\s*(\d+)/)?.[1]);
  check(passingScore === 5, `Quiz ${quizId ?? file} passingScore must be 5, found ${passingScore}`);

  const rewardGE = Number(content.match(/rewardGE:\s*(\d+)/)?.[1]);
  check(rewardGE === 10, `Quiz ${quizId ?? file} rewardGE must be 10, found ${rewardGE}`);

  const types = [...content.matchAll(/type:\s*"([^"]+)"/g)].map((m) => m[1]);
  check(
    types.length === 7 && types.every((t) => t === "multiple-choice" || t === "select-all"),
    `Quiz ${quizId ?? file} question types must be multiple-choice or select-all`
  );

  const correctSets = [...content.matchAll(/correctOptionIds:\s*\[([^\]]*)\]/g)].map(
    (m) => (m[1].match(/"([^"]+)"/g) || []).length
  );
  check(
    correctSets.length === 7 && correctSets.every((n) => n >= 1),
    `Quiz ${quizId ?? file} every question needs at least one correct option`
  );

  const explanations = (content.match(/explanation:\s*\n?\s*["']/g) || []).length;
  check(explanations === 7, `Quiz ${quizId ?? file} every question needs an explanation`);

  check(!content.includes("as const"), `Quiz file ${file} should not contain "as const"`);
}

const quizzesIndex = readFileSync(join(quizzesDir, "index.ts"), "utf-8");
check(
  /export\s+const\s+academyQuizzes/.test(quizzesIndex),
  "academy/quizzes/index.ts should export academyQuizzes"
);

// ─── 11. Homework reflection fields (Sessions 01–04) ──────────────────
console.log("🪞 Checking homework reflection fields...");

const EXPECTED_REFLECTIONS = {
  "homework-01": "favoriteLineExplanation",
  "homework-02": "variableNameReflection",
  "homework-03": "interactivityReflection",
  "homework-04": "ruleDesignReflection",
};
for (const [homeworkId, field] of Object.entries(EXPECTED_REFLECTIONS)) {
  const block = homeworkContent.split(/export const/).find((s) => s.includes(`"${homeworkId}"`));
  check(Boolean(block), `Homework "${homeworkId}" missing from academy/homework/`);
  check(
    Boolean(block && block.includes(`reflectionField: "${field}"`)),
    `Homework "${homeworkId}" must declare reflectionField "${field}"`
  );
  check(
    Boolean(block && /reflectionPrompt:\s*"/.test(block)),
    `Homework "${homeworkId}" must declare a reflectionPrompt`
  );
}

// ─── 12. Check barrel exports ─────────────────────────────────────────
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
