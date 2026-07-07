export interface User {
  id: string;
  displayName: string;
  role: "student" | "teacher";
  totalGE: number;
  rankId: string;
  badgeIds: string[];
  missionStatus: Record<string, "not_started" | "in_progress" | "completed">;
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
