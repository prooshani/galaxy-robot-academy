/**
 * Legacy ID migration maps.
 *
 * Sessions 01–04 adopted the approved stable IDs (mission-01…mission-04,
 * first-contact, memory-engineer, signal-operator, logic-navigator). Data
 * stored before the rename (Firestore progress keys, localStorage, badge
 * lists, old links) is normalized at read time with these maps.
 *
 * No imports — usable from client, server, and node --test alike.
 */

export const LEGACY_MISSION_ID_MAP: Record<string, string> = {
  "mission-1": "mission-01",
  "mission-2": "mission-02",
  "mission-3": "mission-03",
  "mission-4": "mission-04",
};

export const LEGACY_BADGE_ID_MAP: Record<string, string> = {
  "badge-start": "first-contact",
  "badge-logic": "logic-navigator",
};

export function normalizeMissionId(id: string): string {
  return LEGACY_MISSION_ID_MAP[id] ?? id;
}

export function normalizeBadgeId(id: string): string {
  return LEGACY_BADGE_ID_MAP[id] ?? id;
}
