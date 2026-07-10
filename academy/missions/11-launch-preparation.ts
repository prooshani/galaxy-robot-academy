/**
 * Mission 11 — Launch Preparation
 *
 * Canonical mission definition for Session 11.
 */

export const mission11 = {
  missionId: "mission-11",
  sessionNumber: 11,
  slug: "launch-preparation",
  title: "Launch Sequence",
  shortTitle: "Launch Preparation",
  story:
    "The final preparations begin. R0-B0 must execute a complex launch sequence with multiple checks, validations, and fail-safes.",
  summary:
    "Build a complex multi-step process system with validation, error handling, and state management.",
  learningObjectives: [
    "Build a complex multi-step process system",
    "Implement validation and error handling",
    "Manage application state",
  ],
  objectives: [
    "Build a complex multi-step process system",
    "Implement validation and error handling",
    "Manage application state",
  ],
  requiredTasks: [
    "Create a launch sequence state machine",
    "Implement validation checks for each step",
    "Add rollback capability for failed steps",
  ],
  bonusTasks: ["Add a progress tracker", "Implement a simulation mode"],
  rewardGE: 225,
  badgeIds: ["badge-launch"],
  prerequisites: ["mission-10"],
  estimatedMinutes: 70,
  status: "published",
  robotUpgrade: "Launch Controller v1.0",
  spaceFact:
    "The International Space Station orbits Earth every 90 minutes, meaning astronauts see 16 sunrises and sunsets each day.",
  submissionInstructions:
    "Submit your launch sequence system. Show the state machine, validation checks, and rollback capability.",
};
