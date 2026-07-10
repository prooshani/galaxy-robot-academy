/**
 * Mission 6 — Navigation Scanner
 *
 * Canonical mission definition for Session 6.
 */

export const mission6 = {
  missionId: "mission-6",
  sessionNumber: 6,
  slug: "navigation-scanner",
  title: "Star Chart Decoder",
  shortTitle: "Navigation Scanner",
  story:
    "R0-B0 finds an ancient star chart encoded in binary. Decode the coordinates to plot a safe course through the asteroid belt.",
  summary:
    "Work with arrays and data structures, decode binary information, and plot coordinates on a grid.",
  learningObjectives: [
    "Work with arrays and data structures",
    "Decode binary information",
    "Plot coordinates on a grid",
  ],
  objectives: [
    "Work with arrays and data structures",
    "Decode binary information",
    "Plot coordinates on a grid",
  ],
  requiredTasks: [
    "Parse the binary star chart data",
    "Convert coordinates to a grid position",
    "Plot the safe route",
  ],
  bonusTasks: ["Handle invalid coordinates gracefully", "Add a distance calculator"],
  rewardGE: 125,
  badgeIds: ["badge-array"],
  prerequisites: ["mission-5"],
  estimatedMinutes: 60,
  status: "published",
  robotUpgrade: "Navigation Scanner v1.0",
  spaceFact:
    "The Milky Way galaxy contains between 100 and 400 billion stars, and most of them have at least one planet orbiting them.",
  submissionInstructions:
    "Submit your star chart decoding code. Show the parsed coordinates and the plotted route.",
};
