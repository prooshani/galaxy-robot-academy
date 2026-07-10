/**
 * Mission 12 — Mission to Andromeda
 *
 * Canonical mission definition for Session 12 — Final Project.
 */

export const mission12 = {
  missionId: "mission-12",
  sessionNumber: 12,
  slug: "mission-to-andromeda",
  title: "Mission to Andromeda",
  shortTitle: "Final Project",
  story:
    "The final mission! R0-B0 must combine all learned skills to navigate to the Andromeda galaxy. This is the ultimate test of everything you've learned.",
  summary:
    "Combine selected course skills into a small final robot adventure.",
  learningObjectives: [
    "Combine all learned skills into one project",
    "Plan and build a complete small program",
    "Demonstrate mastery of course concepts",
  ],
  objectives: [
    "Combine all learned skills into one project",
    "Plan and build a complete small program",
    "Demonstrate mastery of course concepts",
  ],
  requiredTasks: [
    "Write a short program plan",
    "Implement core navigation logic",
    "Add one random event",
    "Create a final report or presentation",
  ],
  bonusTasks: ["Add one creative ending", "Let the player try again"],
  rewardGE: 300,
  badgeIds: ["badge-final", "badge-andromeda"],
  prerequisites: ["mission-11"],
  estimatedMinutes: 90,
  status: "published",
  robotUpgrade: "Andromeda Drive v1.0",
  spaceFact:
    "The Andromeda galaxy is 2.537 million light-years away and is the closest major galaxy to the Milky Way. It will collide with us in about 4.5 billion years.",
  submissionInstructions:
    "Submit your complete Andromeda mission project. Include your architecture design, all implemented features, and a demonstration of the system in action.",
};
