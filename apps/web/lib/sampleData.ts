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
  badgeIds: ["first-contact", "memory-engineer", "signal-operator"],
  missionStatus: {
    "mission-01": "completed",
    "mission-02": "completed",
    "mission-03": "completed",
    "mission-04": "notStarted",
  },
  missionTasksCompleted: {
    "mission-01": {
      requiredTasks: [true, true, true],
      bonusTasks: [true, false, false],
    },
    "mission-02": {
      requiredTasks: [true, true, true, true],
      bonusTasks: [false, false],
    },
    "mission-03": {
      requiredTasks: [true, true, true, true],
      bonusTasks: [false, false, false],
    },
    "mission-04": {
      requiredTasks: [false, false, false, false],
      bonusTasks: [false, false, false],
    },
  },
  quizzes: {},
  createdAt: "2026-07-01T00:00:00Z",
};
