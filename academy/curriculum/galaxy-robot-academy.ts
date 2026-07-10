/**
 * Course manifest — single source of truth for course-level metadata.
 *
 * This file is the canonical course definition. Educational content authors
 * should edit this file to update course metadata. Application code must
 * never embed course metadata directly.
 */

export const courseManifest = {
  courseId: "gra-core",
  slug: "galaxy-robot-academy",
  title: "Galaxy Robot Academy",
  subtitle: "Mission to Andromeda",
  description:
    "A 12-session robotics and programming course for ages 9–10. Students program a robot companion, R0-B0, on a journey through the galaxy.",
  targetAgeMin: 9,
  targetAgeMax: 10,
  estimatedWeeks: 6,
  sessionsPerWeek: 2,
  totalSessions: 12,
  status: "active",
  missionIds: [
    "mission-1",
    "mission-2",
    "mission-3",
    "mission-4",
    "mission-5",
    "mission-6",
    "mission-7",
    "mission-8",
    "mission-9",
    "mission-10",
    "mission-11",
    "mission-12",
  ],
  finalProjectMissionId: "mission-12",
  version: 1,
};
