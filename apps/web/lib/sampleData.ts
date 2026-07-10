import type { Badge, Mission, User } from "@galaxy/types";

export const missions: Mission[] = [
  {
    missionId: "mission-1",
    sessionNumber: 1,
    title: "Hello, Galaxy!",
    story:
      "R0-B0 has landed on a distant planet and needs to send its first signal home.",
    objectives: [
      "Write your first program",
      "Print a greeting to the console",
      "Understand variables",
    ],
    requiredTasks: [
      "Open a text editor",
      "Write a print statement",
      "Run the program",
    ],
    bonusTasks: ["Add your name to the greeting", "Print a second message"],
    rewardGE: 50,
    badgeIds: ["badge-start"],
  },
  {
    missionId: "mission-2",
    sessionNumber: 2,
    title: "Robot Dance Party",
    story:
      "R0-B0 discovered a dance floor made of light-up tiles. Can you program the perfect routine?",
    objectives: [
      "Use loops to repeat actions",
      "Combine sequences",
      "Think about timing",
    ],
    requiredTasks: [
      "Create a loop that runs 4 times",
      "Add a different move each iteration",
      "Run and test",
    ],
    bonusTasks: [
      "Add a pause between moves",
      "Create a second dance pattern",
    ],
    rewardGE: 75,
    badgeIds: ["badge-loop"],
  },
  {
    missionId: "mission-3",
    sessionNumber: 3,
    title: "Maze Navigator",
    story:
      "A maze of asteroids blocks the path home. Program R0-B0 to find the way through.",
    objectives: [
      "Use conditionals to make decisions",
      "Handle multiple paths",
      "Think ahead",
    ],
    requiredTasks: [
      "Write an if/else statement",
      "Handle at least 2 branches",
      "Test with different inputs",
    ],
    bonusTasks: [
      "Add a counter for steps taken",
      "Handle the 'no path' case",
    ],
    rewardGE: 100,
    badgeIds: ["badge-logic"],
  },
  {
    missionId: "mission-4",
    sessionNumber: 4,
    title: "Signal Booster",
    story:
      "The signal to home base is weak. Build a program that amplifies and cleans up the transmission.",
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
    bonusTasks: [
      "Chain two functions together",
      "Add error handling",
    ],
    rewardGE: 125,
    badgeIds: ["badge-function"],
  },
];

export const user: User = {
  id: "student-1",
  displayName: "Engineer Nova",
  role: null,
  totalGE: 225,
  rankId: "navigator",
  badgeIds: ["badge-start", "badge-loop", "badge-logic"],
  missionStatus: {
    "mission-1": "completed",
    "mission-2": "completed",
    "mission-3": "completed",
    "mission-4": "notStarted",
  },
  missionTasksCompleted: {
    "mission-1": {
      requiredTasks: [true, true, true],
      bonusTasks: [true, false],
    },
    "mission-2": {
      requiredTasks: [true, true, true],
      bonusTasks: [false, false],
    },
    "mission-3": {
      requiredTasks: [true, true, true],
      bonusTasks: [false, false],
    },
    "mission-4": {
      requiredTasks: [false, false, false],
      bonusTasks: [false, false],
    },
  },
  createdAt: "2026-07-01T00:00:00Z",
};

export const badges: Badge[] = [
  {
    badgeId: "badge-start",
    name: "First Contact",
    category: "milestone",
    description: "Completed your first mission and sent your first signal.",
    icon: "📡",
  },
  {
    badgeId: "badge-loop",
    name: "Loop Master",
    category: "skill",
    description: "Mastered the art of repeating actions with loops.",
    icon: "🔄",
  },
  {
    badgeId: "badge-logic",
    name: "Maze Runner",
    category: "skill",
    description: "Navigated a complex maze using conditionals.",
    icon: "🧭",
  },
  {
    badgeId: "badge-function",
    name: "Signal Pro",
    category: "skill",
    description: "Built reusable signal functions.",
    icon: "🔧",
  },
];
