/**
 * Mission 2 — Memory Module
 *
 * Canonical mission definition for Session 2.
 */

export const mission2 = {
  missionId: "mission-2",
  sessionNumber: 2,
  slug: "memory-module",
  title: "Robot Dance Party",
  shortTitle: "Memory Module",
  story:
    "R0-B0 discovered a dance floor made of light-up tiles. Can you program the perfect routine using loops to repeat actions?",
  summary:
    "Use loops to repeat actions, combine sequences, and think about timing to create a dance routine.",
  learningObjectives: [
    "Use loops to repeat actions",
    "Combine sequences",
    "Think about timing",
  ],
  objectives: [
    "Use loops to repeat actions",
    "Combine sequences",
    "Think about timing",
  ],
  requiredTasks: [
    "Create a loop that runs 4 times",
    "Add a different move each iteration",
    "Run and test",
  ],
  bonusTasks: ["Add a pause between moves", "Create a second dance pattern"],
  rewardGE: 75,
  badgeIds: ["badge-loop"],
  prerequisites: ["mission-1"],
  estimatedMinutes: 50,
  status: "published",
  robotUpgrade: "Motion Controller v1.0",
  spaceFact:
    "A day on Venus is longer than a year on Venus — it takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
  submissionInstructions:
    "Submit your loop-based dance routine code. Show at least 4 different moves in a repeating pattern.",
};
