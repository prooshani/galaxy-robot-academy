/**
 * Mission 5 — Repeat Protocol
 *
 * Canonical mission definition for Session 5.
 */

export const mission5 = {
  missionId: "mission-5",
  sessionNumber: 5,
  slug: "repeat-protocol",
  title: "The Repeating Signal",
  shortTitle: "Repeat Protocol",
  story:
    "R0-B0 detects a repeating pattern in the cosmic background noise. Decode the signal by identifying and extending the pattern.",
  summary:
    "Identify repeating patterns in data, use nested loops, and create pattern-matching logic.",
  learningObjectives: [
    "Identify repeating patterns",
    "Use nested loops",
    "Create pattern-matching logic",
  ],
  objectives: [
    "Identify repeating patterns",
    "Use nested loops",
    "Create pattern-matching logic",
  ],
  requiredTasks: [
    "Analyze the signal pattern",
    "Write a nested loop to reproduce it",
    "Test with different signal lengths",
  ],
  bonusTasks: ["Detect when a pattern breaks", "Add a visual indicator for pattern changes"],
  rewardGE: 100,
  badgeIds: ["badge-pattern"],
  prerequisites: ["mission-4"],
  estimatedMinutes: 50,
  status: "published",
  robotUpgrade: "Pattern Analyzer v1.0",
  spaceFact:
    "Pulsars are rotating neutron stars that emit beams of radiation at incredibly regular intervals — some spin hundreds of times per second.",
  submissionInstructions:
    "Submit your pattern detection and reproduction code. Show how it handles different pattern lengths.",
};
