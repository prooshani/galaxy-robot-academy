/**
 * Mission 3 — Communication Systems
 *
 * Canonical mission definition for Session 3.
 */

export const mission3 = {
  missionId: "mission-3",
  sessionNumber: 3,
  slug: "communication-systems",
  title: "Communication Systems",
  shortTitle: "Communication Systems",
  story:
    "Mission Control needs R0-B0 to ask an engineer for a call sign and destination before launch.",
  summary:
    "Read keyboard input and use it in a friendly response.",
  learningObjectives: [
    "Ask a clear question",
    "Store user input",
    "Print a response using the input",
  ],
  objectives: [
    "Ask a clear question",
    "Store user input",
    "Print a response using the input",
  ],
  requiredTasks: [
    "Ask for an engineer name",
    "Ask for a destination",
    "Print a launch message",
  ],
  bonusTasks: ["Ask one more question", "Personalize the final message"],
  rewardGE: 100,
  badgeIds: ["badge-start"],
  prerequisites: ["mission-2"],
  estimatedMinutes: 55,
  status: "published",
  robotUpgrade: "Decision Core v1.0",
  spaceFact:
    "Light from the Sun takes about 8 minutes to reach Earth, but 40 minutes to reach Saturn.",
  submissionInstructions:
    "Submit the short program that asks questions and prints the answers.",
};
