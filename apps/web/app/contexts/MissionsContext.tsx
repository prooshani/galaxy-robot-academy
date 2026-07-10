"use client";

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Mission } from "@galaxy/types";
import { canonicalMissions } from "@/lib/academyContent";

const MISSIONS_STORAGE_KEY = "gra_missions";

function parseMission(value: unknown): Mission | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.missionId !== "string" ||
    typeof v.sessionNumber !== "number" ||
    typeof v.title !== "string" ||
    typeof v.story !== "string" ||
    !Array.isArray(v.objectives) ||
    !Array.isArray(v.requiredTasks) ||
    !Array.isArray(v.bonusTasks) ||
    typeof v.rewardGE !== "number" ||
    !Array.isArray(v.badgeIds)
  ) {
    return null;
  }
  return {
    missionId: v.missionId,
    sessionNumber: v.sessionNumber,
    title: v.title,
    story: v.story,
    objectives: v.objectives as string[],
    requiredTasks: v.requiredTasks as string[],
    bonusTasks: v.bonusTasks as string[],
    rewardGE: v.rewardGE,
    badgeIds: v.badgeIds as string[],
    // Preserve optional extended fields for curriculum metadata
    slug: typeof v.slug === "string" ? v.slug : undefined,
    shortTitle: typeof v.shortTitle === "string" ? v.shortTitle : undefined,
    summary: typeof v.summary === "string" ? v.summary : undefined,
    status:
      typeof v.status === "string" &&
      ["draft", "review", "published", "archived"].includes(v.status)
        ? (v.status as Mission["status"])
        : undefined,
    courseId: typeof v.courseId === "string" ? v.courseId : undefined,
    prerequisites: Array.isArray(v.prerequisites)
      ? (v.prerequisites as string[])
      : undefined,
    estimatedMinutes:
      typeof v.estimatedMinutes === "number" ? v.estimatedMinutes : undefined,
    learningObjectives: Array.isArray(v.learningObjectives)
      ? (v.learningObjectives as string[])
      : undefined,
    robotUpgrade:
      typeof v.robotUpgrade === "string" ? v.robotUpgrade : undefined,
    spaceFact: typeof v.spaceFact === "string" ? v.spaceFact : undefined,
    submissionInstructions:
      typeof v.submissionInstructions === "string"
        ? v.submissionInstructions
        : undefined,
  };
}

function parseStoredMissions(value: unknown): Mission[] | null {
  if (!Array.isArray(value)) return null;
  const parsed: Mission[] = [];
  for (const item of value) {
    const p = parseMission(item);
    if (p) parsed.push(p);
  }
  return parsed;
}

function loadInitialMissions(): Mission[] {
  if (typeof window === "undefined") {
    return canonicalMissions;
  }

  try {
    const stored = window.localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (!stored) return canonicalMissions;

    const parsed = parseStoredMissions(JSON.parse(stored));
    if (!parsed) return canonicalMissions;

    // Merge: ensure all canonical missions exist, preserve user-created ones
    const canonicalIds = new Set(canonicalMissions.map((m) => m.missionId));
    const userMissions = parsed.filter((m) => !canonicalIds.has(m.missionId));

    // If localStorage only contains canonical missions (e.g. old mission-1..4),
    // return fresh canonical data to ensure content is up to date.
    if (userMissions.length === 0 && parsed.every((m) => canonicalIds.has(m.missionId))) {
      return canonicalMissions;
    }

    return [...canonicalMissions, ...userMissions];
  } catch {
    // Ignore storage/parsing errors and fall back to canonical missions.
    return canonicalMissions;
  }
}

const MissionsContext = createContext<{
  missions: Mission[];
  addMission: (mission: Omit<Mission, "missionId">) => void;
  updateMission: (missionId: string, updates: Partial<Omit<Mission, "missionId">>) => void;
  deleteMission: (missionId: string) => void;
} | null>(null);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>(loadInitialMissions);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        MISSIONS_STORAGE_KEY,
        JSON.stringify(missions)
      );
    } catch {
      // Ignore storage failures so context state remains usable.
    }
  }, [missions]);

  const addMission = (mission: Omit<Mission, "missionId">) => {
    const newMission: Mission = {
      ...mission,
      missionId: `mission-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    setMissions((prev) => [...prev, newMission]);
  };

  const updateMission = (missionId: string, updates: Partial<Omit<Mission, "missionId">>) => {
    setMissions((prev) =>
      prev.map((m) => (m.missionId === missionId ? { ...m, ...updates } : m))
    );
  };

  const deleteMission = (missionId: string) => {
    setMissions((prev) => prev.filter((m) => m.missionId !== missionId));
  };

  const value = useMemo(() => ({ missions, addMission, updateMission, deleteMission }), [missions]);

  return (
    <MissionsContext.Provider value={value}>
      {children}
    </MissionsContext.Provider>
  );
}

export function useMissionsContext() {
  const context = useContext(MissionsContext);

  if (!context) {
    throw new Error("useMissionsContext must be used within a MissionsProvider");
  }

  return context;
}

/**
 * @deprecated Use `useMissionsContext` instead. This alias is provided for
 * backwards compatibility and will be removed in a future release.
 */
export const useMissions = useMissionsContext;
