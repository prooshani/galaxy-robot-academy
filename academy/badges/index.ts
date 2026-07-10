/**
 * Canonical badge definitions.
 *
 * Contains all 13 badges referenced by the 12 mission definitions.
 * The original 4 badge IDs are preserved exactly for localStorage
 * backward compatibility.
 *
 * This file is NOT part of the pnpm workspace — plain object literals only.
 */

export const badgeStart = {
  badgeId: "badge-start",
  name: "First Contact",
  category: "milestone",
  description: "Completed your first mission and sent your first signal.",
  icon: "📡",
};

export const badgeLoop = {
  badgeId: "badge-loop",
  name: "Loop Master",
  category: "skill",
  description: "Mastered the art of repeating actions with loops.",
  icon: "🔄",
};

export const badgeLogic = {
  badgeId: "badge-logic",
  name: "Maze Runner",
  category: "skill",
  description: "Navigated a complex maze using conditionals.",
  icon: "🧭",
};

export const badgeFunction = {
  badgeId: "badge-function",
  name: "Signal Pro",
  category: "skill",
  description: "Built reusable signal functions.",
  icon: "🔧",
};

export const badgePattern = {
  badgeId: "badge-pattern",
  name: "Pattern Decoder",
  category: "skill",
  description: "Decoded repeating patterns in cosmic signals.",
  icon: "🔁",
};

export const badgeArray = {
  badgeId: "badge-array",
  name: "Star Chart Navigator",
  category: "skill",
  description: "Decoded binary star charts and plotted safe routes.",
  icon: "⭐",
};

export const badgeData = {
  badgeId: "badge-data",
  name: "Cargo Master",
  category: "skill",
  description: "Built a complete inventory management system.",
  icon: "📦",
};

export const badgeModule = {
  badgeId: "badge-module",
  name: "Module Architect",
  category: "skill",
  description: "Refactored code into reusable, modular components.",
  icon: "🧩",
};

export const badgeExplorer = {
  badgeId: "badge-explorer",
  name: "Planet Surveyor",
  category: "skill",
  description: "Conducted a full planetary survey with multi-sensor data.",
  icon: "🪐",
};

export const badgeRandom = {
  badgeId: "badge-random",
  name: "Event Handler",
  category: "skill",
  description: "Built a robust random event system with recovery.",
  icon: "⚡",
};

export const badgeLaunch = {
  badgeId: "badge-launch",
  name: "Launch Commander",
  category: "skill",
  description: "Executed a complex multi-step launch sequence.",
  icon: "🚀",
};

export const badgeFinal = {
  badgeId: "badge-final",
  name: "Mission Complete",
  category: "milestone",
  description: "Completed all 12 core missions of Galaxy Robot Academy.",
  icon: "🏆",
};

export const badgeAndromeda = {
  badgeId: "badge-andromeda",
  name: "Andromeda Voyager",
  category: "milestone",
  description: "Successfully navigated to the Andromeda galaxy.",
  icon: "🌌",
};

/**
 * Ordered collection of all canonical badges.
 */
export const academyBadges = [
  badgeStart,
  badgeLoop,
  badgeLogic,
  badgeFunction,
  badgePattern,
  badgeArray,
  badgeData,
  badgeModule,
  badgeExplorer,
  badgeRandom,
  badgeLaunch,
  badgeFinal,
  badgeAndromeda,
];
