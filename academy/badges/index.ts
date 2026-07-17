/**
 * Canonical badge definitions.
 *
 * Contains all badges referenced by the 12 mission definitions.
 * Sessions 01–04 use the approved badge IDs (first-contact,
 * memory-engineer, signal-operator, logic-navigator). Legacy IDs from
 * earlier releases (badge-start, badge-logic) are migrated at read time
 * via LEGACY_BADGE_ID_MAP in the web adapter.
 *
 * This file is NOT part of the pnpm workspace — plain object literals only.
 */

export const badgeFirstContact = {
  badgeId: "first-contact",
  name: "First Contact",
  category: "milestone",
  description: "Installed the Speech Module and sent your first signal to the Galaxy Council.",
  icon: "📡",
};

export const badgeMemoryEngineer = {
  badgeId: "memory-engineer",
  name: "Memory Engineer",
  category: "skill",
  description: "Installed the Memory Core and stored R0-B0's profile in clear variables.",
  icon: "🧠",
};

export const badgeSignalOperator = {
  badgeId: "signal-operator",
  name: "Signal Operator",
  category: "skill",
  description: "Opened the Communication Channel with input(), int(), and f-strings.",
  icon: "🛰️",
};

export const badgeLogicNavigator = {
  badgeId: "logic-navigator",
  name: "Logic Navigator",
  category: "skill",
  description: "Activated the Decision Core and chose safe paths with if, elif, and else.",
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
  badgeFirstContact,
  badgeMemoryEngineer,
  badgeSignalOperator,
  badgeLogicNavigator,
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
