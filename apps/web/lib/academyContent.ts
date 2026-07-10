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
 * Lookup a mission by its missionId.
 */
export function getMissionById(id: string): Mission | undefined {
  return canonicalMissions.find((m) => m.missionId === id);
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
 * Lookup homework by missionId.
 */
export function getHomeworkByMissionId(missionId: string): HomeworkMission | undefined {
  return canonicalHomework.find((h) => h.missionId === missionId);
}

/**
 * Get all homework assignments.
 */
export function getAllHomework(): HomeworkMission[] {
  return [...canonicalHomework];
}
