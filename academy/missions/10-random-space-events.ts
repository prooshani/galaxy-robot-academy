/**
 * Mission 10 — Random Space Events
 *
 * Canonical mission definition for Session 10.
 */

export const mission10 = {
  missionId: "mission-10",
  sessionNumber: 10,
  slug: "random-space-events",
  title: "Event Horizon",
  shortTitle: "Random Events",
  story:
    "Random space events threaten the mission — solar flares, meteor showers, and gravitational anomalies. Build a random event system with proper handling.",
  summary:
    "Use the random module to choose a simple space event.",
  learningObjectives: [
    "Import the random module",
    "Choose from a short event list",
    "Print the chosen event",
  ],
  objectives: [
    "Import the random module",
    "Choose from a short event list",
    "Print the chosen event",
  ],
  requiredTasks: [
    "Create three event messages",
    "Choose one at random",
    "Print R0-B0's response",
  ],
  bonusTasks: ["Add one event", "Run the program three times"],
  rewardGE: 200,
  badgeIds: ["badge-random"],
  prerequisites: ["mission-9"],
  estimatedMinutes: 65,
  status: "published",
  robotUpgrade: "Event System v1.0",
  spaceFact:
    "A teaspoon of neutron star material would weigh about 6 billion tons on Earth due to extreme density.",
  submissionInstructions:
    "Submit your random event system. Demonstrate at least 3 event types with proper handling and recovery.",
};
