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
    "R0-B0 scans numbered sectors and must count the readings that are safe for travel.",
  summary:
    "Combine loops with numbers to count and scan repeated readings.",
  learningObjectives: [
    "Count with a loop",
    "Update a number",
    "Print scan progress",
  ],
  objectives: [
    "Count with a loop",
    "Update a number",
    "Print scan progress",
  ],
  requiredTasks: [
    "Loop through numbered sectors",
    "Count the scanned sectors",
    "Print the final count",
  ],
  bonusTasks: ["Count backwards", "Skip one unsafe sector"],
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
