"use client";

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getRankByGE } from "@galaxy/config";
import type { User, Mission, MissionStatus, UserRole, TaskCompletionStatus } from "@galaxy/types";
import { user as initialUser } from "@/lib/sampleData";
import { canonicalMissions } from "@/lib/academyContent";

const USER_STORAGE_KEY = "gra_userState";
const MISSIONS_STORAGE_KEY = "gra_missions";
const VALID_MISSION_STATUSES: MissionStatus[] = [
  "notStarted",
  "submitted",
  "reviewed",
  "completed",
];

// Parse a single mission record from stored data (mirrors MissionsContext.parseMission)
function parseMissionRecord(value: unknown): Mission | null {
  if (!isRecord(value)) return null;
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

// Load all missions: merge canonical academy data with localStorage-persisted teacher missions
function loadAllMissions(): Mission[] {
  if (typeof window === "undefined") return canonicalMissions;
  try {
    const stored = window.localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (!stored) return canonicalMissions;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return canonicalMissions;
    const valid: Mission[] = [];
    for (const item of parsed) {
      const m = parseMissionRecord(item);
      if (m) valid.push(m);
    }
    // Merge: stored missions take priority (teacher edits win), then canonical missions not in storage
    const storedIds = new Set(valid.map((m) => m.missionId));
    return [...valid, ...canonicalMissions.filter((m) => !storedIds.has(m.missionId))];
  } catch {
    return canonicalMissions;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissionStatus(value: unknown): value is MissionStatus {
  return (
    typeof value === "string" &&
    VALID_MISSION_STATUSES.includes(value as MissionStatus)
  );
}

// Normalize missionStatus so every mission has an entry, defaulting to "notStarted"
function normalizeMissionStatus(initial: User["missionStatus"]): User["missionStatus"] {
  const normalized: Record<string, MissionStatus> = {};
  // Preserve all existing entries (including dynamically-created missions)
  for (const [missionId, status] of Object.entries(initial)) {
    if (isMissionStatus(status)) {
      normalized[missionId] = status;
    }
  }
  // Ensure all missions (sample + teacher-created) have a default entry
  for (const mission of loadAllMissions()) {
    if (!normalized[mission.missionId]) {
      normalized[mission.missionId] = "notStarted";
    }
  }
  return normalized;
}

// Parse a single mission's task completion status from stored data
function parseTaskCompletionStatus(value: unknown): TaskCompletionStatus | null {
  if (!isRecord(value)) return null;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.requiredTasks) || !Array.isArray(v.bonusTasks)) return null;
  if (!v.requiredTasks.every((t: unknown) => typeof t === "boolean")) return null;
  if (!v.bonusTasks.every((t: unknown) => typeof t === "boolean")) return null;
  return {
    requiredTasks: v.requiredTasks as boolean[],
    bonusTasks: v.bonusTasks as boolean[],
  };
}

// Parse and normalize missionTasksCompleted from stored data
function parseMissionTasksCompleted(value: unknown): User["missionTasksCompleted"] | null {
  if (!isRecord(value)) return null;
  const parsed: User["missionTasksCompleted"] = {};
  for (const [missionId, status] of Object.entries(value)) {
    const parsedStatus = parseTaskCompletionStatus(status);
    if (parsedStatus) {
      parsed[missionId] = parsedStatus;
    }
  }
  return parsed;
}

// Normalize missionTasksCompleted so every mission has an entry with correct array lengths
function normalizeMissionTasksCompleted(
  initial: User["missionTasksCompleted"],
): User["missionTasksCompleted"] {
  const normalized: User["missionTasksCompleted"] = {};
  // Preserve all existing entries
  for (const [missionId, status] of Object.entries(initial)) {
    normalized[missionId] = status;
  }
  // Ensure every mission (sample + teacher-created) has an entry, sized to match current task definitions
  for (const mission of loadAllMissions()) {
    if (!normalized[mission.missionId]) {
      normalized[mission.missionId] = {
        requiredTasks: Array(mission.requiredTasks.length).fill(false),
        bonusTasks: Array(mission.bonusTasks.length).fill(false),
      };
    } else {
      // Resize arrays to match current mission definition
      const existing = normalized[mission.missionId];
      const reqLen = mission.requiredTasks.length;
      const bonLen = mission.bonusTasks.length;
      if (existing.requiredTasks.length !== reqLen || existing.bonusTasks.length !== bonLen) {
        normalized[mission.missionId] = {
          requiredTasks: [
            ...existing.requiredTasks.slice(0, reqLen),
            ...Array(Math.max(0, reqLen - existing.requiredTasks.length)).fill(false),
          ],
          bonusTasks: [
            ...existing.bonusTasks.slice(0, bonLen),
            ...Array(Math.max(0, bonLen - existing.bonusTasks.length)).fill(false),
          ],
        };
      }
    }
  }
  return normalized;
}

function parseMissionStatus(value: unknown): User["missionStatus"] | null {
  if (!isRecord(value)) {
    return null;
  }

  const missionStatus: Record<string, MissionStatus> = {};
  for (const [missionId, status] of Object.entries(value)) {
    if (isMissionStatus(status)) {
      missionStatus[missionId] = status;
    }
  }

  return normalizeMissionStatus(missionStatus);
}

function parseStoredUser(value: unknown): User | null {
  if (!isRecord(value)) {
    return null;
  }

  const missionStatus = parseMissionStatus(value.missionStatus);
  if (!missionStatus) {
    return null;
  }

  const missionTasksCompleted = normalizeMissionTasksCompleted(
    parseMissionTasksCompleted(value.missionTasksCompleted) ?? initialUser.missionTasksCompleted
  );

  if (
    typeof value.id !== "string" ||
    typeof value.displayName !== "string" ||
    typeof value.totalGE !== "number" ||
    typeof value.rankId !== "string" ||
    !Array.isArray(value.badgeIds) ||
    !value.badgeIds.every((badgeId) => typeof badgeId === "string") ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    displayName: value.displayName,
    role:
      value.role === "student" || value.role === "teacher"
        ? value.role
        : null,
    totalGE: value.totalGE,
    rankId: value.rankId,
    badgeIds: value.badgeIds,
    missionStatus,
    missionTasksCompleted,
    createdAt: value.createdAt,
  };
}

function clearStoredUser(): void {
  try {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // Ignore cleanup failures and fall back to sample data.
  }
}

function loadInitialUser(): User {
  if (typeof window === "undefined") {
    return normalizedInitial;
  }

  try {
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) {
      return normalizedInitial;
    }

    const parsedUser = parseStoredUser(JSON.parse(storedUser) as unknown);
    if (parsedUser) {
      return parsedUser;
    }

    clearStoredUser();
  } catch {
    clearStoredUser();
  }

  return normalizedInitial;
}

const normalizedInitial: User = {
  ...initialUser,
  missionStatus: normalizeMissionStatus(initialUser.missionStatus),
  missionTasksCompleted: normalizeMissionTasksCompleted(initialUser.missionTasksCompleted),
};

interface UserContextValue {
  user: User;
  awardGE: (missionId: string, geAwarded: number, badgeIds?: string[]) => void;
  setMissionStatus: (missionId: string, status: MissionStatus) => void;
  setRole: (role: UserRole) => void;
  toggleTaskCompletion: (missionId: string, isBonus: boolean, index: number) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(loadInitialUser);

  useEffect(() => {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage failures so context state remains usable.
    }
  }, [user]);

  const awardGE = (missionId: string, geAwarded: number, badgeIds?: string[]) => {
    setUser((currentUser) => {
      const totalGE = currentUser.totalGE + geAwarded;
      const newBadgeIds = Array.from(
        new Set([...currentUser.badgeIds, ...(badgeIds ?? [])])
      );
      return {
        ...currentUser,
        totalGE,
        rankId: getRankByGE(totalGE),
        badgeIds: newBadgeIds,
        missionStatus: {
          ...currentUser.missionStatus,
          [missionId]: "completed" as const,
        },
      };
    });
  };

  const setMissionStatus = (missionId: string, status: MissionStatus) => {
    setUser((currentUser) => ({
      ...currentUser,
      missionStatus: {
        ...currentUser.missionStatus,
        [missionId]: status,
      },
    }));
  };

  const setRole = (role: UserRole) => {
    setUser((currentUser) => ({ ...currentUser, role }));
  };

  const toggleTaskCompletion = (missionId: string, isBonus: boolean, index: number) => {
    setUser((currentUser) => {
      const existing = currentUser.missionTasksCompleted[missionId] ?? {
        requiredTasks: [],
        bonusTasks: [],
      };
      const key = isBonus ? "bonusTasks" as const : "requiredTasks" as const;
      const newTasks = [...existing[key]];
      // Defensive: grow array if index is beyond current length
      while (newTasks.length <= index) {
        newTasks.push(false);
      }
      newTasks[index] = !newTasks[index];
      return {
        ...currentUser,
        missionTasksCompleted: {
          ...currentUser.missionTasksCompleted,
          [missionId]: { ...existing, [key]: newTasks },
        },
      };
    });
  };

  const value = useMemo(
    () => ({ user, awardGE, setMissionStatus, setRole, toggleTaskCompletion }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
