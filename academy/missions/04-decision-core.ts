/**
 * Mission 4 — Decision Core
 *
 * Canonical mission definition for Session 4.
 */

export const mission4 = {
  missionId: "mission-4",
  sessionNumber: 4,
  slug: "decision-core",
  title: "Decision Core",
  shortTitle: "Decision Core",
  story:
    "R0-B0 reaches a fork in the route and must choose a safe direction from sensor input.",
  summary:
    "Use if and else to make one clear decision.",
  learningObjectives: [
    "Compare a value",
    "Use if and else",
    "Test both outcomes",
  ],
  objectives: [
    "Compare a value",
    "Use if and else",
    "Test both outcomes",
  ],
  requiredTasks: [
    "Ask for a sensor reading",
    "Choose a response with if/else",
    "Run both paths",
  ],
  bonusTasks: ["Add one extra choice", "Explain the chosen route"],
  rewardGE: 125,
  badgeIds: ["badge-logic"],
  prerequisites: ["mission-3"],
  estimatedMinutes: 55,
  status: "published",
  robotUpgrade: "Signal Processor v1.0",
  spaceFact:
    "The Voyager 1 spacecraft, launched in 1977, is now over 15 billion miles from Earth and still sending data back.",
  submissionInstructions:
    "Submit the short decision program and show both outcomes.",
};
