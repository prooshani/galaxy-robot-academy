"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User, Mission, MissionStatus, QuizProgress, TaskCompletionStatus, UserProfile } from "@galaxy/types";
import { user as initialUser } from "@/lib/sampleData";
import { canonicalMissions, normalizeBadgeId, normalizeMissionId } from "@/lib/academyContent";
import { auth } from "@/lib/firebase/client";
import { signOutUser } from "@/lib/firebase/auth";

// Missions are still merged from canonical content + teacher edits in
// localStorage; per-user progress now lives in Firestore (the profile doc).
const MISSIONS_STORAGE_KEY = "gra_missions";
const DELETED_MISSIONS_STORAGE_KEY = "gra_deletedMissionIds";
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
    const deletedIds = parseDeletedMissionIds(window.localStorage.getItem(DELETED_MISSIONS_STORAGE_KEY));
    const storedIds = new Set(valid.map((m) => m.missionId));
    return [...valid, ...canonicalMissions.filter((m) => !storedIds.has(m.missionId) && !deletedIds.has(m.missionId))];
  } catch {
    return canonicalMissions;
  }
}

function parseDeletedMissionIds(value: string | null): Set<string> {
  if (!value) return new Set();
  try {
    const parsed: unknown = JSON.parse(value);
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []);
  } catch { return new Set(); }
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
  // Preserve all existing entries (including dynamically-created missions),
  // migrating legacy mission IDs (mission-1 → mission-01) at read time.
  for (const [missionId, status] of Object.entries(initial)) {
    if (isMissionStatus(status)) {
      normalized[normalizeMissionId(missionId)] = status;
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
  // Preserve all existing entries, migrating legacy mission IDs at read time
  for (const [missionId, status] of Object.entries(initial)) {
    normalized[normalizeMissionId(missionId)] = status;
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
    badgeIds: Array.from(new Set(value.badgeIds.map((id) => normalizeBadgeId(id as string)))),
    missionStatus,
    missionTasksCompleted,
    quizzes: {},
    createdAt: value.createdAt,
  };
}

function parseQuizzes(value: unknown): Record<string, QuizProgress> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const parsed: Record<string, QuizProgress> = {};
  for (const [quizId, progress] of Object.entries(value as Record<string, unknown>)) {
    if (!isRecord(progress)) continue;
    const p = progress as Record<string, unknown>;
    parsed[quizId] = {
      attempts: typeof p.attempts === "number" ? p.attempts : 0,
      bestScore: typeof p.bestScore === "number" ? p.bestScore : 0,
      passed: p.passed === true,
      geAwarded: p.geAwarded === true,
      lastAttemptAt: typeof p.lastAttemptAt === "string" ? p.lastAttemptAt : null,
    };
  }
  return parsed;
}

// Map the authoritative Firestore profile into the app's User shape. Only
// students carry gamification/progress; teachers & admins get neutral values.
function profileToUser(p: UserProfile): User {
  const s = p.role === "student" ? p : null;
  return {
    id: p.uid,
    displayName: p.displayName ?? "Cadet",
    photoURL: p.photoURL ?? null,
    avatarId: p.avatarId ?? null,
    suit: p.suit ?? null,
    role: p.role,
    totalGE: s?.gamification?.totalGE ?? 0,
    rankId: s?.gamification?.rankId ?? "cadet",
    badgeIds: Array.from(new Set((s?.gamification?.badgeIds ?? []).map(normalizeBadgeId))),
    missionStatus: normalizeMissionStatus(s?.progress?.missionStatus ?? {}),
    missionTasksCompleted: normalizeMissionTasksCompleted(s?.progress?.missionTasksCompleted ?? {}),
    quizzes: parseQuizzes(s?.progress?.quizzes ?? {}),
    createdAt: p.createdAt ?? new Date().toISOString(),
  };
}

const normalizedInitial: User = {
  ...initialUser,
  missionStatus: normalizeMissionStatus(initialUser.missionStatus),
  missionTasksCompleted: normalizeMissionTasksCompleted(initialUser.missionTasksCompleted),
};

// Signed-out placeholder. `role: null` is what RoleGuard keys off to redirect.
const anonymousUser: User = { ...normalizedInitial, id: "", displayName: "", photoURL: null, role: null };

interface UserContextValue {
  user: User;
  // "loading" until the Firebase session resolves; then "authed" or "anon".
  authStatus: "loading" | "authed" | "anon";
  setMissionStatus: (missionId: string, status: MissionStatus) => void;
  toggleTaskCompletion: (missionId: string, isBonus: boolean, index: number) => void;
  // Re-pull identity/avatar from Firestore (e.g. after the profile page saves).
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(anonymousUser);
  const [authStatus, setAuthStatus] = useState<"loading" | "authed" | "anon">("loading");
  const [uid, setUid] = useState<string | null>(null);
  // Skip the persist effect for state changes that came FROM Firestore
  // (hydration / refresh), so we don't immediately write back what we read.
  const skipNextSave = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSaveTimer = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
  }, []);

  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      return res.ok ? ((await res.json()) as UserProfile) : null;
    } catch {
      return null;
    }
  }, []);

  // Bridge Firebase auth state -> app user, hydrating progress from Firestore.
  // If the profile fetch fails we stay in "loading" and retry — we never seed
  // a real account from sample data (which the progress sync could then
  // persist) and never guess the role.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (retryTimer.current) {
        clearTimeout(retryTimer.current);
        retryTimer.current = null;
      }
      if (!fbUser) {
        clearSaveTimer();
        setUid(null);
        setUser(anonymousUser);
        setAuthStatus("anon");
        return;
      }
      const hydrate = async () => {
        const profile = await fetchProfile();
        // The user may have signed out (or switched) while we were fetching.
        if (auth.currentUser?.uid !== fbUser.uid) return;
        if (!profile) {
          retryTimer.current = setTimeout(() => {
            void hydrate();
          }, 3000);
          return;
        }
        skipNextSave.current = true;
        setUid(fbUser.uid);
        setUser(profileToUser(profile));
        setAuthStatus("authed");
      };
      setAuthStatus("loading");
      void hydrate();
    });
    return () => {
      unsub();
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [fetchProfile, clearSaveTimer]);

  // Debounced sync of mission progress to Firestore (students only).
  // Gamification (GE, badges, rank) is written ONLY server-side — by quiz
  // attempts and teacher reviews — so the client never overwrites awards.
  useEffect(() => {
    if (authStatus !== "authed" || !uid || user.role !== "student") return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null;
      void fetch("/api/user/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: {
            missionStatus: user.missionStatus,
            missionTasksCompleted: user.missionTasksCompleted,
          },
        }),
      }).catch(() => {
        // Best-effort sync; local state stays authoritative for this session.
      });
    }, 600);
    // Clear the pending save on re-render/unmount so a stale PATCH can never
    // fire after fresher state (e.g. a server refresh) has landed.
    return clearSaveTimer;
  }, [user, uid, authStatus, clearSaveTimer]);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchProfile();
    if (profile) {
      // Drop any queued stale save before adopting the server truth.
      clearSaveTimer();
      skipNextSave.current = true;
      setUser(profileToUser(profile));
    }
  }, [fetchProfile, clearSaveTimer]);

  const signOut = useCallback(async () => {
    clearSaveTimer();
    await signOutUser();
    // onAuthStateChanged will fire and reset to the anonymous user.
  }, [clearSaveTimer]);

  const setMissionStatus = (missionId: string, status: MissionStatus) => {
    setUser((currentUser) => ({
      ...currentUser,
      missionStatus: {
        ...currentUser.missionStatus,
        [missionId]: status,
      },
    }));
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
    () => ({ user, authStatus, setMissionStatus, toggleTaskCompletion, refreshProfile, signOut }),
    [user, authStatus, refreshProfile, signOut]
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
