export type MissionStatus = "notStarted" | "submitted" | "reviewed" | "completed";

export type UserRole = "student" | "teacher";

export interface TaskCompletionStatus {
  requiredTasks: boolean[];
  bonusTasks: boolean[];
}

export interface User {
  id: string;
  displayName: string;
  role: UserRole | null;
  totalGE: number;
  rankId: string;
  badgeIds: string[];
  missionStatus: Record<string, MissionStatus>;
  missionTasksCompleted: Record<string, TaskCompletionStatus>;
  createdAt: string;
}

export interface Mission {
  missionId: string;
  sessionNumber: number;
  title: string;
  story: string;
  objectives: string[];
  requiredTasks: string[];
  bonusTasks: string[];
  rewardGE: number;
  badgeIds: string[];
}

export interface Badge {
  badgeId: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface Rank {
  rankId: string;
  name: string;
  minGE: number;
}

export interface Submission {
  submissionId: string;
  missionId: string;
  userId: string;
  codeSnippet: string;
  timestamp: string;
  status: "submitted" | "reviewed" | "needs_revision";
  geAwarded: number;
  feedback?: string;
}
