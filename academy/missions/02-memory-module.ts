/**
 * Mission 02 — Install the Memory Core
 *
 * Canonical mission definition for Session 2.
 * Source: materials/session-02/WEBSITE_CONTENT.md (approved).
 */

export const mission2 = {
  missionId: "mission-02",
  sessionNumber: 2,
  slug: "install-memory-core",
  title: "Install the Memory Core",
  shortTitle: "Memory Core",
  story:
    "R0-B0 can speak, but it cannot remember its own name, energy level, or destination. Install the Memory Core by storing values in variables so the robot can use them later.",
  summary:
    "Store text and numbers in clearly named variables, then calculate with them to build R0-B0's robot profile.",
  learningObjectives: [
    "Create variables that store text and numbers",
    "Choose clear, descriptive variable names",
    "Calculate a new value using arithmetic",
  ],
  objectives: [
    "Create variables that store text and numbers",
    "Choose clear, descriptive variable names",
    "Calculate a new value using arithmetic",
  ],
  requiredTasks: [
    "Create variables for your robot: name, model, home base, destination, energy, fuel cells, crew size, and favorite tool",
    "Use clear variable names a crewmate could understand",
    "Calculate one remaining or total value (for example energy or fuel)",
    "Print the robot profile so every value is visible",
  ],
  bonusTasks: [
    "Design a second robot with its own variables",
    "Add an emergency calculation (for example energy after a storm)",
  ],
  rewardGE: 60,
  badgeIds: ["memory-engineer"],
  prerequisites: ["mission-01"],
  estimatedMinutes: 80,
  status: "published",
  robotUpgrade: "Memory Core",
  spaceFact:
    "Spacecraft computers store thousands of values — fuel, temperature, position — and update them every second of a mission.",
  submissionInstructions:
    "Paste your exploration robot program: variables for the robot profile plus one calculation.",
  quizId: "quiz-02",
  homeworkId: "homework-02",
  robotMessages: {
    before: "I can speak, but I cannot remember who I am.",
    progress: "A clear variable name helps me find the right memory.",
    revision: "One memory has the wrong type.",
    complete: "Memory Core installed. I know my name, energy, and destination.",
  },
};
