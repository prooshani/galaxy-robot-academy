/**
 * Academy content adapter.
 *
 * Imports canonical mission, badge, and homework data from the academy/
 * directory and exposes application-ready typed collections plus lookup
 * helpers.
 *
 * This file contains NO React code, NO mutable state, and NO UI formatting.
 */

import type { Badge, Course, HomeworkMission, Mission } from "@galaxy/types";

import { academyMissions } from "@academy/missions";
import { academyBadges } from "@academy/badges";
import { academyHomework } from "@academy/homework";
import { courseManifest } from "@academy/curriculum/galaxy-robot-academy";

import { normalizeBadgeId, normalizeMissionId } from "./legacyIds";

export { LEGACY_BADGE_ID_MAP, LEGACY_MISSION_ID_MAP, normalizeBadgeId, normalizeMissionId } from "./legacyIds";

// Student-facing quiz shape (no answer key / explanations). Quiz DATA is
// server-only (lib/serverQuizzes.ts) so answers never reach the client
// bundle; the browser fetches this shape from GET /api/quizzes/[quizId].
export type { StudentQuiz, StudentQuizQuestion } from "./quizLogic";

// Quiz-wide constants per the approved quiz guidelines (enforced for every
// quiz file by scripts/validate-curriculum.mjs), safe for client display.
export const QUIZ_QUESTION_COUNT = 7;
export const QUIZ_PASSING_SCORE = 5;
export const QUIZ_REWARD_GE = 10;

/**
 * The current version of the canonical academy content.
 *
 * Increment this when the canonical content changes in a way that
 * requires re-seeding or migration of user data.
 */
export const ACADEMY_CONTENT_VERSION: number = courseManifest.version;

/**
 * All canonical missions as a plain array (not readonly).
 */
export const canonicalMissions: Mission[] = academyMissions.map((mission) => ({
  ...mission,
  status: parseContentStatus(mission.status),
}));

/**
 * All canonical badges as a plain array (not readonly).
 */
export const canonicalBadges: Badge[] = academyBadges.map((badge) => ({ ...badge }));

/**
 * All homework assignments as a plain array (not readonly).
 */
export const canonicalHomework: HomeworkMission[] = academyHomework.map((homework) => ({
  ...homework,
  status: parseContentStatus(homework.status),
}));

/**
 * The course manifest.
 */
export const canonicalCourse: Course = {
  ...courseManifest,
  status: parseCourseStatus(courseManifest.status),
};

function parseContentStatus(value: string): NonNullable<Mission["status"]> {
  if (value === "draft" || value === "review" || value === "published" || value === "archived") return value;
  throw new Error(`Invalid academy content status: ${value}`);
}

function parseCourseStatus(value: string): Course["status"] {
  if (value === "draft" || value === "active" || value === "archived") return value;
  throw new Error(`Invalid academy course status: ${value}`);
}

/**
 * Lookup a mission by its missionId (legacy IDs are normalized).
 */
export function getMissionById(id: string): Mission | undefined {
  const normalized = normalizeMissionId(id);
  return canonicalMissions.find((m) => m.missionId === normalized);
}

/**
 * Lookup a mission by its slug.
 */
export function getMissionBySlug(slug: string): Mission | undefined {
  return canonicalMissions.find((m) => m.slug === slug);
}

/**
 * Return all canonical missions ordered by session number.
 */
export function getOrderedMissions(): Mission[] {
  return [...canonicalMissions].sort((a, b) => a.sessionNumber - b.sessionNumber);
}

/**
 * Lookup a badge by its badgeId.
 */
export function getBadgeById(id: string): Badge | undefined {
  return canonicalBadges.find((b) => b.badgeId === id);
}

/**
 * Return all canonical badges.
 */
export function getAllBadges(): Badge[] {
  return [...canonicalBadges];
}

/**
 * Lookup homework by missionId (legacy IDs are normalized).
 */
export function getHomeworkByMissionId(missionId: string): HomeworkMission | undefined {
  const normalized = normalizeMissionId(missionId);
  return canonicalHomework.find((h) => h.missionId === normalized);
}

/**
 * Get all homework assignments.
 */
export function getAllHomework(): HomeworkMission[] {
  return [...canonicalHomework];
}
