/**
 * Mission 8 — Reusable Skill Modules
 *
 * Canonical mission definition for Session 8.
 */

export const mission8 = {
  missionId: "mission-8",
  sessionNumber: 8,
  slug: "reusable-skill-modules",
  title: "Skill Module Architect",
  shortTitle: "Reusable Modules",
  story:
    "R0-B0 needs to upgrade its skill modules to be reusable across different missions. Refactor the codebase into modular, reusable components.",
  summary:
    "Refactor code into reusable modules, implement an interface-based design, and create a plugin system.",
  learningObjectives: [
    "Refactor code into reusable modules",
    "Implement interface-based design",
    "Create a plugin system",
  ],
  objectives: [
    "Refactor code into reusable modules",
    "Implement interface-based design",
    "Create a plugin system",
  ],
  requiredTasks: [
    "Identify reusable code patterns",
    "Create a module interface",
    "Implement at least 2 skill modules",
  ],
  bonusTasks: ["Add a module registry", "Implement module dependencies"],
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
