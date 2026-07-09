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
import { missions as initialMissions } from "@/lib/sampleData";

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
    return initialMissions;
  }

  try {
    const stored = window.localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (!stored) return initialMissions;
    const parsed = parseStoredMissions(JSON.parse(stored));
    if (parsed) return parsed;
  } catch {
    // Ignore storage/parsing errors and fall back to sample data.
  }
  return initialMissions;
}

const MissionsContext = createContext<{
  missions: Mission[];
  addMission: (mission: Omit<Mission, "missionId">) => void;
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

  const value = useMemo(() => ({ missions, addMission }), [missions]);

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
