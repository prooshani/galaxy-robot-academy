/**
 * Mission 01 — Wake Up R0-B0
 *
 * Canonical mission definition for Session 1.
 * Educational content authors should edit this file.
 * Source: materials/session-01/WEBSITE_CONTENT.md (approved).
 */

export const mission1 = {
  missionId: "mission-01",
  sessionNumber: 1,
  slug: "wake-up-r0-b0",
  title: "Wake Up R0-B0",
  shortTitle: "Speech Module",
  story:
    "R0-B0's hardware is ready, but its software is empty. The robot has landed on a distant planet and cannot say a single word. Install the Speech Module by writing your first Python program and teaching R0-B0 to speak.",
  summary:
    "Write your first program with print(), learn why text needs quotation marks, and discover that code runs in order.",
  learningObjectives: [
    "Write and run your first print() statement",
    "Explain why text needs quotation marks",
    "Show that code runs from top to bottom, in order",
  ],
  objectives: [
    "Write and run your first print() statement",
    "Explain why text needs quotation marks",
    "Show that code runs from top to bottom, in order",
  ],
  requiredTasks: [
    "Write a print() statement that runs without an error",
    "Print at least eight messages for the Galaxy Council: name, purpose, home base, destination, useful system, warning, joke, and a final message",
    "Run your program and check the messages appear in the right order",
  ],
  bonusTasks: [
    "Add a countdown before the final message",
    "Draw a robot face using print()",
    "Add an alien interruption or an alternate ending",
  ],
  rewardGE: 55,
  badgeIds: ["first-contact"],
  prerequisites: [],
  estimatedMinutes: 80,
  status: "published",
  robotUpgrade: "Speech Module",
  spaceFact:
    "The first message sent from Earth to space was a radio signal in 1924, and it still travels through the galaxy today.",
  submissionInstructions:
    "Paste your Galaxy Council introduction program: at least eight print() messages in a sensible order.",
  quizId: "quiz-01",
  homeworkId: "homework-01",
  robotMessages: {
    before: "My power core is active, but I cannot speak yet.",
    submitted: "Transmission sent. Awaiting review.",
    revision: "Let us inspect the quotation marks and parentheses.",
    complete: "Speech Module installed. Hello, engineers!",
  },
};
