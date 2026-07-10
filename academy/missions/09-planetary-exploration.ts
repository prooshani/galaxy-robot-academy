/**
 * Mission 9 — Planetary Exploration
 *
 * Canonical mission definition for Session 9.
 */

export const mission9 = {
  missionId: "mission-9",
  sessionNumber: 9,
  slug: "planetary-exploration",
  title: "Planet Surveyor",
  shortTitle: "Planetary Exploration",
  story:
    "R0-B0 approaches a new planet system. Build a survey system to collect and analyze planetary data from multiple sensors.",
  summary:
    "Store and read simple planet facts using dictionaries.",
  learningObjectives: [
    "Create a dictionary",
    "Read values by key",
    "Add one new fact",
  ],
  objectives: [
    "Create a dictionary",
    "Read values by key",
    "Add one new fact",
  ],
  requiredTasks: [
    "Store three planet facts",
    "Print two facts by key",
    "Add one discovered fact",
  ],
  bonusTasks: ["Update one fact", "Print all keys"],
  rewardGE: 200,
  badgeIds: ["badge-explorer"],
  prerequisites: ["mission-8"],
  estimatedMinutes: 70,
  status: "published",
  robotUpgrade: "Survey Suite v1.0",
  spaceFact:
    "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth.",
  submissionInstructions:
    "Submit your planetary survey system. Show the sensor interface, data collection, and generated report.",
};
