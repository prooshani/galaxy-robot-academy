/**
 * Mission 04 — Activate the Decision Core
 *
 * Canonical mission definition for Session 4.
 * Source: materials/session-04/WEBSITE_CONTENT.md (approved).
 */

export const mission4 = {
  missionId: "mission-04",
  sessionNumber: 4,
  slug: "activate-decision-core",
  title: "Activate the Decision Core",
  shortTitle: "Decision Core",
  story:
    "R0-B0 has information, but it cannot choose an action. Activate the Decision Core with if, elif, and else so the robot can pick the safe path on any planet.",
  summary:
    "Teach R0-B0 to make decisions with if, elif, and else, comparisons, and carefully ordered rules.",
  learningObjectives: [
    "Write decisions with if, elif, and else",
    "Compare values with ==, >=, and <=",
    "Order rules so every branch can be reached",
  ],
  objectives: [
    "Write decisions with if, elif, and else",
    "Compare values with ==, >=, and <=",
    "Order rules so every branch can be reached",
  ],
  requiredTasks: [
    "Ask for a planet name, a danger level from 1 to 5, and an oxygen answer (yes or no)",
    "Display one of: safe to explore, proceed with caution, or exploration cancelled",
    "Use at least one if, one elif, and one else",
    "Check the rules trigger in the right order",
  ],
  bonusTasks: [
    "Add a temperature check",
    "Add a password clearance step",
    "Add an emergency mode",
  ],
  rewardGE: 65,
  badgeIds: ["logic-navigator"],
  prerequisites: ["mission-03"],
  estimatedMinutes: 85,
  status: "published",
  robotUpgrade: "Decision Core",
  spaceFact:
    "Real Mars rovers make some decisions on their own, because a command from Earth can take up to 24 minutes to arrive.",
  submissionInstructions:
    "Paste your planetary safety scanner: input questions plus if / elif / else rules that choose the right message.",
  quizId: "quiz-04",
  homeworkId: "homework-04",
  robotMessages: {
    before: "I have information, but I do not know what action to choose.",
    progress: "I am checking the rule before selecting a path.",
    revision: "A branch may be unreachable. Let us test the rule order.",
    complete: "Decision Core active. I can choose actions from clear rules.",
  },
};
