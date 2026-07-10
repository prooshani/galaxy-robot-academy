/**
 * Mission 7 — Cargo Inventory
 *
 * Canonical mission definition for Session 7.
 */

export const mission7 = {
  missionId: "mission-7",
  sessionNumber: 7,
  slug: "cargo-inventory",
  title: "Cargo Bay Manager",
  shortTitle: "Cargo Inventory",
  story:
    "R0-B0 needs to organize the cargo bay before the long journey. Build a system to track, sort, and manage inventory items.",
  summary:
    "Build a data management system with sorting, filtering, and search capabilities for inventory tracking.",
  learningObjectives: [
    "Build a data management system",
    "Implement sorting and filtering",
    "Create search functionality",
  ],
  objectives: [
    "Build a data management system",
    "Implement sorting and filtering",
    "Create search functionality",
  ],
  requiredTasks: [
    "Create an inventory data structure",
    "Implement a sort function",
    "Add a search feature",
  ],
  bonusTasks: ["Add item categories", "Implement a weight limit checker"],
  rewardGE: 150,
  badgeIds: ["badge-data"],
  prerequisites: ["mission-6"],
  estimatedMinutes: 60,
  status: "published",
  robotUpgrade: "Inventory Manager v1.0",
  spaceFact:
    "A day on Mercury lasts about 59 Earth days, but a year on Mercury is only 88 Earth days long.",
  submissionInstructions:
    "Submit your inventory management code. Demonstrate sorting, filtering, and searching capabilities.",
};
