import type { Submission } from "@galaxy/types";

export const submissions: Submission[] = [
  {
    submissionId: "sub-1",
    missionId: "mission-1",
    userId: "parshan",
    codeSnippet: 'console.log("Hello, Galaxy!");',
    timestamp: "2026-07-02T10:30:00Z",
    status: "reviewed",
    geAwarded: 50,
    feedback: "Great start! Your first signal was clear and strong.",
  },
  {
    submissionId: "sub-2",
    missionId: "mission-1",
    userId: "adryan",
    codeSnippet: 'console.log("Hello, Galaxy! I am ready.");',
    timestamp: "2026-07-03T14:15:00Z",
    status: "submitted",
    geAwarded: 0,
  },
  {
    submissionId: "sub-3",
    missionId: "mission-2",
    userId: "parshan",
    codeSnippet:
      "for (let i = 0; i < 4; i++) {\n  moveForward();\n  turnRight();\n}",
    timestamp: "2026-07-04T09:00:00Z",
    status: "reviewed",
    geAwarded: 75,
    feedback: "Excellent loop structure. Your robot danced perfectly!",
  },
  {
    submissionId: "sub-4",
    missionId: "mission-2",
    userId: "nova",
    codeSnippet:
      "let moves = ['forward', 'left', 'forward', 'right'];\nfor (const m of moves) { perform(m); }",
    timestamp: "2026-07-05T16:45:00Z",
    status: "needs_revision",
    geAwarded: 0,
    feedback: "Good creativity, but the pattern doesn't form a closed loop. Try using a for-loop instead.",
  },
  {
    submissionId: "sub-5",
    missionId: "mission-3",
    userId: "adryan",
    codeSnippet:
      "if (pathAhead) {\n  moveForward();\n} else {\n  turnLeft();\n}",
    timestamp: "2026-07-06T11:20:00Z",
    status: "reviewed",
    geAwarded: 80,
    feedback: "Solid conditional logic. Consider adding a step counter for the bonus task.",
  },
  {
    submissionId: "sub-6",
    missionId: "mission-3",
    userId: "parshan",
    codeSnippet:
      "function findPath(grid: number[][]): boolean {\n  // TODO: implement BFS\n  return false;\n}",
    timestamp: "2026-07-07T08:00:00Z",
    status: "submitted",
    geAwarded: 0,
  },
  {
    submissionId: "sub-7",
    missionId: "mission-4",
    userId: "nova",
    codeSnippet:
      "function amplify(signal: string): string {\n  return signal.toUpperCase().trim();\n}",
    timestamp: "2026-07-07T13:30:00Z",
    status: "needs_revision",
    geAwarded: 0,
    feedback: "The function works but doesn't handle null input. Add error handling for the bonus task.",
  },
  {
    submissionId: "sub-8",
    missionId: "mission-4",
    userId: "adryan",
    codeSnippet:
      "function chain(a: string, b: string): string {\n  return a + b;\n}",
    timestamp: "2026-07-07T15:00:00Z",
    status: "submitted",
    geAwarded: 0,
  },
];
