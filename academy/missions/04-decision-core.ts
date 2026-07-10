/**
 * Mission 4 — Decision Core
 *
 * Canonical mission definition for Session 4.
 */

export const mission4 = {
  missionId: "mission-4",
  sessionNumber: 4,
  slug: "decision-core",
  title: "Signal Booster",
  shortTitle: "Decision Core",
  story:
    "The signal to home base is weak. Build a program that amplifies and cleans up the transmission using reusable functions.",
  summary:
    "Work with functions, pass data between functions, and debug a broken program to restore communications.",
  learningObjectives: [
    "Work with functions",
    "Pass data between functions",
    "Debug a broken program",
  ],
  objectives: [
    "Work with functions",
    "Pass data between functions",
    "Debug a broken program",
  ],
  requiredTasks: [
    "Write a function that takes input",
    "Return a transformed value",
    "Call the function with test data",
  ],
  bonusTasks: ["Chain two functions together", "Add error handling"],
  rewardGE: 125,
  badgeIds: ["badge-function"],
  prerequisites: ["mission-3"],
  estimatedMinutes: 55,
  status: "published",
  robotUpgrade: "Signal Processor v1.0",
  spaceFact:
    "The Voyager 1 spacecraft, launched in 1977, is now over 15 billion miles from Earth and still sending data back.",
  submissionInstructions:
    "Submit your function-based signal processing code. Include at least one function that transforms input data.",
};
