/**
 * Homework definitions — one per mission.
 *
 * Sessions 01–04 carry the approved teaching material from
 * materials/session-0X/HOMEWORK.md. Sessions 05–12 remain lightweight
 * structural placeholders until their material is approved.
 *
 * This file is NOT part of the pnpm workspace — plain object literals only.
 */

export const homework1 = {
  homeworkId: "homework-01",
  missionId: "mission-01",
  title: "Galaxy Council Introduction",
  summary:
    "Write a program with at least eight print() messages that introduces your robot to the Galaxy Council.",
  requiredTasks: [
    "Print at least eight messages",
    "Include: name, purpose, home base, destination, useful system, warning, joke, and a final message",
    "Run the program and check the order makes sense",
  ],
  bonusChallenge:
    "Add a countdown, a robot face, an alien interruption, or an alternate ending.",
  estimatedMinutes: 20,
  rewardGE: 40,
  status: "published",
  reflectionField: "favoriteLineExplanation",
  reflectionPrompt: "Which line is your favorite, and why?",
};

export const homework2 = {
  homeworkId: "homework-02",
  missionId: "mission-02",
  title: "Design an Exploration Robot",
  summary:
    "Create variables that describe your own exploration robot, then calculate one remaining or total value.",
  requiredTasks: [
    "Create variables for: robot name, model, home base, destination, energy, fuel cells, crew size, and favorite tool",
    "Calculate one remaining or total value",
    "Print the values so the profile is visible",
  ],
  bonusChallenge: "Add a second robot or an emergency calculation.",
  estimatedMinutes: 20,
  rewardGE: 45,
  status: "published",
  reflectionField: "variableNameReflection",
  reflectionPrompt: "Which variable name are you most proud of, and why?",
};

export const homework3 = {
  homeworkId: "homework-03",
  missionId: "mission-03",
  title: "Crew Interview",
  summary:
    "Create an interactive program that interviews a crew member and builds a final report from their answers.",
  requiredTasks: [
    "Ask at least five questions: name, mission role, destination, age, and favorite space food",
    "Use all the answers in a final report",
    "Include one numeric calculation",
  ],
  bonusChallenge: "Add a secret question, a custom greeting, or a supply total.",
  estimatedMinutes: 20,
  rewardGE: 45,
  status: "published",
  reflectionField: "interactivityReflection",
  reflectionPrompt: "Which question made your program feel most interactive?",
};

export const homework4 = {
  homeworkId: "homework-04",
  missionId: "mission-04",
  title: "Planetary Safety Scanner",
  summary:
    "Build a safety scanner that asks about a planet and decides whether exploration is safe.",
  requiredTasks: [
    "Ask for: planet name, danger level 1–5, and an oxygen answer (yes or no)",
    "Display one of: safe to explore, proceed with caution, or exploration cancelled",
    "Use at least one if, one elif, and one else",
  ],
  bonusChallenge: "Add temperature, password clearance, or an emergency mode.",
  estimatedMinutes: 20,
  rewardGE: 50,
  status: "published",
  reflectionField: "ruleDesignReflection",
  reflectionPrompt: "Which rule was hardest to design, and why?",
};

export const homework5 = {
  homeworkId: "hw-5",
  missionId: "mission-5",
  title: "Pattern Finder",
  summary: "Find and extend a repeating pattern in a sequence.",
  requiredTasks: [
    "Identify the repeating unit",
    "Write code to generate the next 5 elements",
  ],
  bonusChallenge: "Detect when a pattern breaks.",
  estimatedMinutes: 20,
  rewardGE: 20,
  status: "draft",
};

export const homework6 = {
  homeworkId: "hw-6",
  missionId: "mission-6",
  title: "Coordinate Mapper",
  summary: "Convert a list of coordinates into a grid visualization.",
  requiredTasks: [
    "Parse coordinate data",
    "Map coordinates to grid positions",
  ],
  bonusChallenge: "Add a distance calculator between two points.",
  estimatedMinutes: 20,
  rewardGE: 25,
  status: "draft",
};

export const homework7 = {
  homeworkId: "hw-7",
  missionId: "mission-7",
  title: "Inventory Sorter",
  summary: "Build a system to sort and filter inventory items.",
  requiredTasks: [
    "Create an inventory data structure",
    "Implement a sort function",
  ],
  bonusChallenge: "Add a search feature by category.",
  estimatedMinutes: 20,
  rewardGE: 25,
  status: "draft",
};

export const homework8 = {
  homeworkId: "hw-8",
  missionId: "mission-8",
  title: "Reusable Robot Greeting",
  summary: "Turn one robot greeting into a simple function.",
  requiredTasks: [
    "Define one greeting function",
    "Call it twice",
  ],
  bonusChallenge: "Pass a name into the function.",
  estimatedMinutes: 20,
  rewardGE: 30,
  status: "draft",
};

export const homework9 = {
  homeworkId: "hw-9",
  missionId: "mission-9",
  title: "Sensor Report",
  summary: "Store three planet facts in a dictionary.",
  requiredTasks: [
    "Create a dictionary",
    "Print two values by key",
  ],
  bonusChallenge: "Add one new planet fact.",
  estimatedMinutes: 20,
  rewardGE: 30,
  status: "draft",
};

export const homework10 = {
  homeworkId: "hw-10",
  missionId: "mission-10",
  title: "Event Simulator",
  summary: "Choose and print one random space event.",
  requiredTasks: [
    "Write three event messages",
    "Choose one with random.choice",
  ],
  bonusChallenge: "Run it three times and compare results.",
  estimatedMinutes: 20,
  rewardGE: 30,
  status: "draft",
};

export const homework11 = {
  homeworkId: "hw-11",
  missionId: "mission-11",
  title: "Launch Checklist",
  summary: "Write a short checklist for the final project.",
  requiredTasks: [
    "List three project steps",
    "Test one reused skill",
  ],
  bonusChallenge: "Add one debugging note.",
  estimatedMinutes: 20,
  rewardGE: 35,
  status: "draft",
};

export const homework12 = {
  homeworkId: "hw-12",
  missionId: "mission-12",
  title: "Final Project: Andromeda",
  summary: "Combine all skills into a final project navigating to Andromeda.",
  requiredTasks: [
    "Write a short project plan",
    "Implement core navigation logic",
    "Add one random event",
  ],
  bonusChallenge: "Add a creative ending.",
  estimatedMinutes: 20,
  rewardGE: 50,
  status: "draft",
};

/**
 * All homework items ordered by mission session number.
 */
export const academyHomework = [
  homework1,
  homework2,
  homework3,
  homework4,
  homework5,
  homework6,
  homework7,
  homework8,
  homework9,
  homework10,
  homework11,
  homework12,
];
