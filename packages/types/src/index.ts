/** Project version — Major.minor.patch. Single source of truth; bump on release
 *  (MAJOR: breaking, MINOR: features, PATCH: fixes). Keep root package.json in sync. */
export const APP_VERSION = "0.1.0";

export type MissionStatus = "notStarted" | "submitted" | "reviewed" | "completed";
export type MissionContentStatus = "draft" | "review" | "published" | "archived";

export type UserRole = "student" | "teacher" | "admin";

/** Each role's profiles live in their own top-level Firestore collection. */
export const ROLE_COLLECTIONS: Record<UserRole, string> = {
  student: "students",
  teacher: "teachers",
  admin: "admins",
};

/** Roles allowed into Mission Control / teacher tooling. */
export function canTeach(role: UserRole | null | undefined): boolean {
  return role === "teacher" || role === "admin";
}

export interface TaskCompletionStatus {
  requiredTasks: boolean[];
  bonusTasks: boolean[];
}

export interface User {
  id: string;
  displayName: string;
  photoURL?: string | null;
  avatarId?: string | null;
  suit?: SuitConfig | null;
  role: UserRole | null;
  totalGE: number;
  rankId: string;
  badgeIds: string[];
  missionStatus: Record<string, MissionStatus>;
  missionTasksCompleted: Record<string, TaskCompletionStatus>;
  quizzes: Record<string, QuizProgress>;
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
  // Optional extended fields for curriculum authoring
  slug?: string;
  shortTitle?: string;
  summary?: string;
  status?: MissionContentStatus;
  courseId?: string;
  prerequisites?: string[];
  estimatedMinutes?: number;
  learningObjectives?: string[];
  robotUpgrade?: string;
  spaceFact?: string;
  submissionInstructions?: string;
  quizId?: string;
  homeworkId?: string;
  robotMessages?: RobotMessages;
}

// ============================================================
// Quiz engine — structured, auto-gradable question types only.
// ============================================================

export type QuizQuestionType = "multiple-choice" | "select-all";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  questionId: string;
  type: QuizQuestionType;
  prompt: string;
  /** Optional preformatted code block shown with the prompt. */
  code?: string;
  options: QuizOption[];
  /** Exactly one id for multiple-choice; one or more for select-all. */
  correctOptionIds: string[];
  /** Shown immediately after the student answers. */
  explanation: string;
}

export interface Quiz {
  quizId: string;
  missionId: string;
  title: string;
  /** Correct answers required to pass (e.g. 5 of 7). */
  passingScore: number;
  /** GE awarded once, on the first passing attempt. */
  rewardGE: number;
  questions: QuizQuestion[];
}

/** Per-quiz progress persisted on the student profile (server-written). */
export interface QuizProgress {
  attempts: number;
  bestScore: number;
  passed: boolean;
  geAwarded: boolean;
  lastAttemptAt: ISODateString | null;
}

/** R0-B0 dialogue for each homework/submission state of a mission. */
export interface RobotMessages {
  before: string;
  progress?: string;
  submitted?: string;
  revision: string;
  complete: string;
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
  /** Homework this submission answers (e.g. "homework-01"). */
  homeworkId?: string;
  /** The student's written reflection answer. */
  reflection?: string;
  /** Set once when the teacher approves — guards duplicate badge awards. */
  badgeAwardedIds?: string[];
  /** Teacher marked the approved work as excellent. */
  excellent?: boolean;
  /** Number of times the student re-sent after a revision request. */
  resubmissionCount?: number;
  // Server-enriched display fields (never stored as canonical data):
  studentName?: string;
  quizProgress?: QuizProgress | null;
}

export interface Course {
  courseId: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  targetAgeMin: number;
  targetAgeMax: number;
  estimatedWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  status: "draft" | "active" | "archived";
  missionIds: string[];
  finalProjectMissionId: string;
  version: number;
}

export interface HomeworkMission {
  homeworkId: string;
  missionId: string;
  title: string;
  summary: string;
  requiredTasks: string[];
  bonusChallenge?: string;
  estimatedMinutes: number;
  rewardGE: number;
  status: MissionContentStatus;
  /** Name of the reflection field for this session (e.g. "favoriteLineExplanation"). */
  reflectionField?: string;
  /** The reflection question shown to the student. */
  reflectionPrompt?: string;
}

// ============================================================
// User profile — the authoritative, Firestore-backed account record.
// Designed as a complete profile store so new product surfaces
// (billing, referrals, courses, contact) don't require a schema change.
// Bump USER_PROFILE_SCHEMA_VERSION + write a migration when the shape changes.
// ============================================================

export const USER_PROFILE_SCHEMA_VERSION = 1;

/** Lifecycle state of the account itself. */
export type AccountStatus = "active" | "inactive" | "suspended" | "pending";

/** Subscription plan tier. Extend as commercial tiers are defined. */
export type PlanTier = "free" | "explorer" | "cadet" | "commander" | "academy";

/** Billing state, aligned with common processor (e.g. Stripe) semantics. */
export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export type CourseEnrollmentStatus =
  | "enrolled"
  | "in_progress"
  | "completed"
  | "dropped";

/** ISO 8601 datetime string (UTC), e.g. "2026-07-11T19:41:58.244Z". */
export type ISODateString = string;

export interface PostalAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null; // ISO 3166-1 alpha-2
}

export interface ContactInfo {
  phone: string | null; // E.164, e.g. "+41791234567"
  phoneVerified: boolean;
  address: PostalAddress;
  timezone: string | null; // IANA, e.g. "Europe/Zurich"
  locale: string | null; // BCP-47, e.g. "en-CH"
}

/** Personal details. Guardian fields matter for a minors' platform. */
export interface PersonalInfo {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: ISODateString | null;
  bio: string | null;
  school: string | null;
  gradeLevel: string | null;
  guardianName: string | null;
  guardianEmail: string | null;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  theme: "system" | "dark" | "light";
  language: string; // BCP-47
  marketingOptIn: boolean;
}

export interface Subscription {
  plan: PlanTier;
  status: SubscriptionStatus;
  startedAt: ISODateString | null;
  currentPeriodEnd: ISODateString | null; // plan expiry
  trialEndsAt: ISODateString | null;
  cancelAtPeriodEnd: boolean;
  provider: string | null; // "stripe" | "manual" | ...
  customerId: string | null; // external billing customer id
  subscriptionId: string | null; // external subscription id
  seats: number;
}

/** Gamification / progress rollup (authoritative copy of GE, level, badges). */
export interface Gamification {
  totalGE: number;
  level: number;
  rankId: string;
  badgeIds: string[];
  streakDays: number;
  lastActivityAt: ISODateString | null;
}

export interface CourseEnrollment {
  courseId: string;
  status: CourseEnrollmentStatus;
  enrolledAt: ISODateString;
  completedAt: ISODateString | null;
  progressPct: number; // 0–100
}

export interface AffiliateInfo {
  code: string | null; // this user's own referral code
  referredByCode: string | null;
  referredByUid: string | null;
  referralCount: number;
}

export interface AccountFlags {
  isActive: boolean;
  isVerified: boolean; // trusted/verified account (feature gating)
  emailVerified: boolean;
  onboardingComplete: boolean;
}

/** Per-mission progress (authoritative copy, migrated off localStorage). */
export interface MissionProgress {
  missionStatus: Record<string, MissionStatus>;
  missionTasksCompleted: Record<string, TaskCompletionStatus>;
  /** Per-quiz progress keyed by quizId. Written only server-side. */
  quizzes?: Record<string, QuizProgress>;
}

/** Teaching profile — the "capitan" (teacher) role-specific record. */
export interface TeachingInfo {
  title: string | null; // e.g. "Flight Instructor"
  bio: string | null;
  subjects: string[]; // e.g. ["Robotics", "Python"]
  cohortIds: string[]; // classes/cohorts they lead
  managedCourseIds: string[]; // courses they author/own
  yearsExperience: number | null;
  verified: boolean; // credential-checked
}

export type AdminAccessLevel = "owner" | "manager" | "support";

/** Admin role-specific record. */
export interface AdminInfo {
  accessLevel: AdminAccessLevel;
  permissions: string[]; // fine-grained capability flags
}

/** Fields shared by every role, whichever collection the doc lives in. */
export interface BaseProfile {
  schemaVersion: number;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null; // uploaded avatar — Firebase Storage download URL
  avatarId: string | null; // legacy space-suit preset id (see SPACE_AVATARS)
  suit: SuitConfig | null; // 3D suit customizer configuration (see SuitStudio)
  role: UserRole;
  status: AccountStatus;
  flags: AccountFlags;
  contact: ContactInfo;
  personal: PersonalInfo;
  preferences: UserPreferences;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastLoginAt: ISODateString | null;
}

/** A class/group a student is assigned to (set by staff). */
export interface StudentGroup {
  groupId: string | null;
  groupName: string | null;
}

/** Students (collection "students"): space suit, GE, courses, subscription. */
export interface StudentProfile extends BaseProfile {
  role: "student";
  gamification: Gamification;
  progress: MissionProgress;
  courses: CourseEnrollment[];
  subscription: Subscription;
  affiliate: AffiliateInfo;
  group: StudentGroup;
}

/** Teachers / capitans (collection "teachers"): teaching-focused fields. */
export interface TeacherProfile extends BaseProfile {
  role: "teacher";
  teaching: TeachingInfo;
}

/** Admins (collection "admins"): access + permissions. */
export interface AdminProfile extends BaseProfile {
  role: "admin";
  admin: AdminInfo;
}

export type AnyProfile = StudentProfile | TeacherProfile | AdminProfile;

/** Back-compat alias: a profile of unknown role. */
export type UserProfile = AnyProfile;

/** Top-level keys the account owner may edit directly, per role. Everything
 *  else (role, status, subscription, gamification, teaching.verified, admin, …)
 *  is server/admin-only, enforced in both Firestore rules and the API. */
const OWNER_EDITABLE_BASE = ["displayName", "avatarId", "suit", "contact", "personal", "preferences"] as const;

export const OWNER_EDITABLE_BY_ROLE: Record<UserRole, readonly string[]> = {
  student: OWNER_EDITABLE_BASE,
  teacher: [...OWNER_EDITABLE_BASE, "teaching"],
  admin: OWNER_EDITABLE_BASE,
};

/** Selectable space-suit avatars. `accent` drives the suit/visor palette in
 *  the SpaceAvatar renderer; `id` is what gets stored on the profile. */
export interface SpaceAvatarPreset {
  id: string;
  name: string;
  accent: string; // hex
  visor: string; // hex
}

/**
 * Real-time 3D suit customizer configuration (rendered by `SuitStudio`).
 * Every field is user-tunable; `chassis` swaps the geometry loadout while the
 * colours retint shared PBR materials. This is the canonical, monetizable
 * cadet-identity object — persisted on the profile as `suit`.
 */
export interface SuitConfig {
  modelId: string | null; // real GLB suit id (see suits.catalog); null = procedural model
  chassis: SuitChassisId; // procedural geometry / armour loadout (used when modelId is null)
  finish: SuitFinishId; // material response (matte / satin / gloss / carbon) — applies to both
  suit: string; // hex — primary armour shell (procedural)
  accent: string; // hex — trim, energy lines, indicator lights
  visor: string; // hex — helmet visor tint (procedural)
  metal: string; // hex — hardware / joints / structural metal (procedural)
  underlay: string; // hex — soft under-suit fabric between plates (procedural)
}

export type SuitChassisId = "recon" | "vanguard" | "aero" | "titan";
export type SuitFinishId = "matte" | "satin" | "gloss" | "carbon";

export interface SuitChassis {
  id: SuitChassisId;
  name: string;
  tagline: string;
  premium: boolean; // gated behind a paid tier (monetization hook)
}

export interface SuitFinish {
  id: SuitFinishId;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
}

export const SUIT_CHASSIS: readonly SuitChassis[] = [
  { id: "recon", name: "Recon", tagline: "Lightweight EVA scout rig", premium: false },
  { id: "vanguard", name: "Vanguard", tagline: "Armoured command loadout", premium: false },
  { id: "aero", name: "Aero", tagline: "Streamlined atmospheric flight", premium: false },
  { id: "titan", name: "Titan", tagline: "Heavy deep-space exo-frame", premium: true },
];

export const SUIT_FINISHES: readonly SuitFinish[] = [
  { id: "matte", name: "Matte", roughness: 0.85, metalness: 0.15, clearcoat: 0.0 },
  { id: "satin", name: "Satin", roughness: 0.5, metalness: 0.35, clearcoat: 0.25 },
  { id: "gloss", name: "Gloss", roughness: 0.18, metalness: 0.55, clearcoat: 0.9 },
  { id: "carbon", name: "Carbon", roughness: 0.35, metalness: 0.85, clearcoat: 0.6 },
];

/** The suit every new cadet starts in. */
export const DEFAULT_SUIT: SuitConfig = {
  modelId: "blue-cadet",
  chassis: "recon",
  finish: "satin",
  suit: "#20263A",
  accent: "#AF50FF",
  visor: "#E9D5FF",
  metal: "#8A94A6",
  underlay: "#0E1424",
};

/** Curated one-tap looks shown as presets in the studio. */
export const SUIT_PRESETS: readonly { id: string; name: string; config: SuitConfig }[] = [
  { id: "nova", name: "Nova", config: { modelId: null, chassis: "recon", finish: "satin", suit: "#20263A", accent: "#AF50FF", visor: "#E9D5FF", metal: "#8A94A6", underlay: "#140A24" } },
  { id: "comet", name: "Comet", config: { modelId: null, chassis: "aero", finish: "gloss", suit: "#152238", accent: "#38BDF8", visor: "#BAE6FD", metal: "#94A0B4", underlay: "#0A1730" } },
  { id: "aurora", name: "Aurora", config: { modelId: null, chassis: "recon", finish: "matte", suit: "#16241E", accent: "#34D399", visor: "#A7F3D0", metal: "#8A94A6", underlay: "#0A1B14" } },
  { id: "solar", name: "Solar", config: { modelId: null, chassis: "vanguard", finish: "satin", suit: "#2A2416", accent: "#FBBF24", visor: "#FDE68A", metal: "#9AA0A8", underlay: "#241B0A" } },
  { id: "nebula", name: "Nebula", config: { modelId: null, chassis: "aero", finish: "gloss", suit: "#2A1626", accent: "#F472B6", visor: "#FBCFE8", metal: "#9A8FA0", underlay: "#240A1E" } },
  { id: "meteor", name: "Meteor", config: { modelId: null, chassis: "vanguard", finish: "carbon", suit: "#241416", accent: "#FB7185", visor: "#FECDD3", metal: "#8A8488", underlay: "#1E0A0C" } },
  { id: "ion", name: "Ion", config: { modelId: null, chassis: "recon", finish: "satin", suit: "#1A1E36", accent: "#818CF8", visor: "#C7D2FE", metal: "#8A90A6", underlay: "#0E1130" } },
  { id: "titan", name: "Titan", config: { modelId: null, chassis: "titan", finish: "carbon", suit: "#14181F", accent: "#2DD4BF", visor: "#99F6E4", metal: "#7C848F", underlay: "#08120F" } },
];

/** Coerce arbitrary stored data into a valid, fully-populated SuitConfig. */
export function normalizeSuit(input: unknown): SuitConfig {
  const s = (input ?? {}) as Partial<SuitConfig>;
  const hex = (v: unknown, fallback: string) =>
    typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
  const chassis = SUIT_CHASSIS.some((c) => c.id === s.chassis) ? (s.chassis as SuitChassisId) : DEFAULT_SUIT.chassis;
  const finish = SUIT_FINISHES.some((f) => f.id === s.finish) ? (s.finish as SuitFinishId) : DEFAULT_SUIT.finish;
  return {
    modelId: typeof s.modelId === "string" ? s.modelId : null,
    chassis,
    finish,
    suit: hex(s.suit, DEFAULT_SUIT.suit),
    accent: hex(s.accent, DEFAULT_SUIT.accent),
    visor: hex(s.visor, DEFAULT_SUIT.visor),
    metal: hex(s.metal, DEFAULT_SUIT.metal),
    underlay: hex(s.underlay, DEFAULT_SUIT.underlay),
  };
}

export const SPACE_AVATARS: readonly SpaceAvatarPreset[] = [
  { id: "nova", name: "Nova", accent: "#AF50FF", visor: "#E9D5FF" },
  { id: "comet", name: "Comet", accent: "#38BDF8", visor: "#BAE6FD" },
  { id: "aurora", name: "Aurora", accent: "#34D399", visor: "#A7F3D0" },
  { id: "solar", name: "Solar", accent: "#FBBF24", visor: "#FDE68A" },
  { id: "nebula", name: "Nebula", accent: "#F472B6", visor: "#FBCFE8" },
  { id: "meteor", name: "Meteor", accent: "#FB7185", visor: "#FECDD3" },
  { id: "ion", name: "Ion", accent: "#818CF8", visor: "#C7D2FE" },
  { id: "quasar", name: "Quasar", accent: "#2DD4BF", visor: "#99F6E4" },
] as const;

export const DEFAULT_AVATAR_ID = "nova";
