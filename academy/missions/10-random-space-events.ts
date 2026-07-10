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
    "Implement a random event generator, create event handlers, and build a robust error recovery system.",
  learningObjectives: [
    "Implement a random event generator",
    "Create event handlers",
    "Build a robust error recovery system",
  ],
  objectives: [
    "Implement a random event generator",
    "Create event handlers",
    "Build a robust error recovery system",
  ],
  requiredTasks: [
    "Create an event type system",
    "Implement at least 3 event types",
    "Add event handling and recovery",
  ],
  bonusTasks: ["Add event probability weighting", "Implement event chaining"],
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
