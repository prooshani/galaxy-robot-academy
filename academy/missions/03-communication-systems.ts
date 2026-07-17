/**
 * Mission 03 — Open the Communication Channel
 *
 * Canonical mission definition for Session 3.
 * Source: materials/session-03/WEBSITE_CONTENT.md (approved).
 */

export const mission3 = {
  missionId: "mission-03",
  sessionNumber: 3,
  slug: "open-communication-channel",
  title: "Open the Communication Channel",
  shortTitle: "Communication Channel",
  story:
    "R0-B0 can send messages, but it cannot hear the crew. Open the Communication Channel by asking questions with input(), storing the answers, and responding with f-strings.",
  summary:
    "Ask questions with input(), convert numbers with int(), and build friendly replies with f-strings.",
  learningObjectives: [
    "Ask the user questions with input()",
    "Store answers in variables and use them later",
    "Convert text to numbers with int() and reply using f-strings",
  ],
  objectives: [
    "Ask the user questions with input()",
    "Store answers in variables and use them later",
    "Convert text to numbers with int() and reply using f-strings",
  ],
  requiredTasks: [
    "Ask at least five questions: name, mission role, destination, age, and favorite space food",
    "Store every answer in its own variable",
    "Use all the answers in a final report",
    "Include one numeric calculation (for example age next year)",
  ],
  bonusTasks: [
    "Add a secret question with a special reply",
    "Build a custom greeting from the answers",
    "Calculate a supply total for the crew",
  ],
  rewardGE: 60,
  badgeIds: ["signal-operator"],
  prerequisites: ["mission-02"],
  estimatedMinutes: 80,
  status: "published",
  robotUpgrade: "Communication Channel",
  spaceFact:
    "A radio message from Earth takes between 4 and 24 minutes to reach Mars — astronauts cannot have a live conversation with home.",
  submissionInstructions:
    "Paste your crew interview program: five input() questions used in a final report with one calculation.",
  quizId: "quiz-03",
  homeworkId: "homework-03",
  robotMessages: {
    before: "I can send messages, but I cannot hear your answers.",
    progress: "Signal received. I am storing your response.",
    revision: "One answer is not being used. Let us trace the variable.",
    complete: "Communication Channel open. I can ask, receive, and respond.",
  },
};
