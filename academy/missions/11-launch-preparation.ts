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
    "The final preparations begin. R0-B0 must assemble the small skills from earlier missions into one launch program.",
  summary:
    "Plan and assemble the pieces needed for the final project.",
  learningObjectives: [
    "Plan a program in small steps",
    "Reuse earlier code",
    "Test the assembled project",
  ],
  objectives: [
    "Plan a program in small steps",
    "Reuse earlier code",
    "Test the assembled project",
  ],
  requiredTasks: [
    "Write a short project plan",
    "Combine two earlier robot skills",
    "Test each step",
  ],
  bonusTasks: ["Add one optional robot skill", "Explain one debugging choice"],
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
