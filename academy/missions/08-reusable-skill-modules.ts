/**
 * Mission 8 — Reusable Skill Modules
 *
 * Canonical mission definition for Session 8.
 */

export const mission8 = {
  missionId: "mission-8",
  sessionNumber: 8,
  slug: "reusable-skill-modules",
  title: "Reusable Skills",
  shortTitle: "Reusable Modules",
  story:
    "R0-B0 repeats the same actions on every planet. Turn one action into a reusable function.",
  summary:
    "Define and call simple functions with clear inputs.",
  learningObjectives: [
    "Define a function",
    "Pass one value to a function",
    "Call a function more than once",
  ],
  objectives: [
    "Define a function",
    "Pass one value to a function",
    "Call a function more than once",
  ],
  requiredTasks: [
    "Choose one repeated action",
    "Move it into a function",
    "Call the function twice",
  ],
  bonusTasks: ["Add a second parameter", "Return a value"],
  rewardGE: 175,
  badgeIds: ["badge-module"],
  prerequisites: ["mission-7"],
  estimatedMinutes: 65,
  status: "published",
  robotUpgrade: "Module Framework v1.0",
  spaceFact:
    "Space is completely silent because there is no atmosphere to carry sound waves — no air means no sound.",
  submissionInstructions:
    "Submit your modular code architecture. Show the interface definition and at least 2 implemented modules.",
};
