/**
 * Mission 2 — Memory Module
 *
 * Canonical mission definition for Session 2.
 */

export const mission2 = {
  missionId: "mission-2",
  sessionNumber: 2,
  slug: "memory-module",
  title: "Memory Module",
  shortTitle: "Memory Module",
  story:
    "R0-B0 needs to remember its name, energy level, and destination. Store each value so the robot can use it later.",
  summary:
    "Use variables to store and update simple information.",
  learningObjectives: [
    "Create variables",
    "Use clear variable names",
    "Print stored values",
  ],
  objectives: [
    "Create variables",
    "Use clear variable names",
    "Print stored values",
  ],
  requiredTasks: [
    "Store R0-B0's name",
    "Store an energy value",
    "Print both values",
  ],
  bonusTasks: ["Update the energy value", "Store a destination"],
  rewardGE: 75,
  badgeIds: ["badge-start"],
  prerequisites: ["mission-1"],
  estimatedMinutes: 50,
  status: "published",
  robotUpgrade: "Memory Module v1.0",
  spaceFact:
    "A day on Venus is longer than a year on Venus — it takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
  submissionInstructions:
    "Submit the short program that stores and prints R0-B0's information.",
};
