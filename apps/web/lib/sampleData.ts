import type { User } from "@galaxy/types";

/**
 * Default user state for initial app load.
 *
 * This is the only fallback data remaining in this file.
 * Mission and badge definitions have been migrated to the
 * canonical academy content source under `academy/`.
 */
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
