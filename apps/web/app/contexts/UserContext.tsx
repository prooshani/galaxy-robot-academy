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
import type { User, MissionStatus, UserRole } from "@galaxy/types";
import { user as initialUser, missions } from "@/lib/sampleData";

const USER_STORAGE_KEY = "gra_userState";
const VALID_MISSION_STATUSES: MissionStatus[] = [
  "notStarted",
  "submitted",
  "reviewed",
  "completed",
];

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
  // Ensure sample missions have a default entry
  for (const mission of missions) {
    if (!normalized[mission.missionId]) {
      normalized[mission.missionId] = "notStarted";
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
};

interface UserContextValue {
  user: User;
  awardGE: (missionId: string, geAwarded: number, badgeIds?: string[]) => void;
  setMissionStatus: (missionId: string, status: MissionStatus) => void;
  setRole: (role: UserRole) => void;
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

  const value = useMemo(
    () => ({ user, awardGE, setMissionStatus, setRole }),
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
