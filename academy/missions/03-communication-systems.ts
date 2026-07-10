/**
 * Mission 3 — Communication Systems
 *
 * Canonical mission definition for Session 3.
 */

export const mission3 = {
  missionId: "mission-3",
  sessionNumber: 3,
  slug: "communication-systems",
  title: "Maze Navigator",
  shortTitle: "Communication Systems",
  story:
    "A maze of asteroids blocks the path home. Program R0-B0 to find the way through using conditionals to make decisions at each intersection.",
  summary:
    "Use conditionals to make decisions, handle multiple paths, and think ahead to navigate through obstacles.",
  learningObjectives: [
    "Use conditionals to make decisions",
    "Handle multiple paths",
    "Think ahead",
  ],
  objectives: [
    "Use conditionals to make decisions",
    "Handle multiple paths",
    "Think ahead",
  ],
  requiredTasks: [
    "Write an if/else statement",
    "Handle at least 2 branches",
    "Test with different inputs",
  ],
  bonusTasks: ["Add a counter for steps taken", "Handle the 'no path' case"],
  rewardGE: 100,
  badgeIds: ["badge-logic"],
  prerequisites: ["mission-2"],
  estimatedMinutes: 55,
  status: "published",
  robotUpgrade: "Decision Core v1.0",
  spaceFact:
    "Light from the Sun takes about 8 minutes to reach Earth, but 40 minutes to reach Saturn.",
  submissionInstructions:
    "Submit your conditional navigation code. Demonstrate handling at least 2 different path decisions.",
};
