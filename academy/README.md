# Galaxy Robot Academy — Curriculum Content

## Directory Structure

```
academy/
├── curriculum/
│   └── galaxy-robot-academy.ts    # Course manifest
├── missions/
│   ├── index.ts                   # Barrel export (ordered collection)
│   ├── 01-wake-up-r0-b0.ts        # Session 1
│   ├── 02-memory-module.ts        # Session 2
│   ├── 03-communication-systems.ts # Session 3
│   ├── 04-decision-core.ts        # Session 4
│   ├── 05-repeat-protocol.ts      # Session 5
│   ├── 06-navigation-scanner.ts   # Session 6
│   ├── 07-cargo-inventory.ts      # Session 7
│   ├── 08-reusable-skill-modules.ts # Session 8
│   ├── 09-planetary-exploration.ts # Session 9
│   ├── 10-random-space-events.ts  # Session 10
│   ├── 11-launch-preparation.ts   # Session 11
│   └── 12-mission-to-andromeda.ts # Session 12
├── badges/
│   └── index.ts                   # All 13 badge definitions
└── homework/
    └── index.ts                   # 12 homework placeholders
```

## Authoring Rules

### 1. Plain Object Literals

Each mission file exports a single plain object literal:

```ts
export const mission1 = {
  missionId: "mission-1",
  sessionNumber: 1,
  title: "Hello, Galaxy!",
  story: "...",
  objectives: ["..."],
  requiredTasks: ["..."],
  bonusTasks: ["..."],
  rewardGE: 50,
  badgeIds: ["badge-start"],
  // Optional extended fields
  slug: "hello-galaxy",
  shortTitle: "Hello, Galaxy!",
  summary: "Send your first signal home.",
  status: "published",
};
```

### 2. No Workspace Imports

Academy files **must not** import from `@galaxy/types` or any workspace package. They use plain object literals only. The `apps/web/lib/academyContent.ts` adapter handles type casting.

### 3. No `as const` on Barrels

The barrel index files (`index.ts`) must **not** use `as const` on their exported arrays. The arrays end with `];`, not `] as const;`. This allows the adapter to cast them to mutable arrays.

### 4. Field Naming Conventions

- `missionId`: `"mission-N"` format (N = 1-12)
- `badgeId`: `"badge-<name>"` format
- `homeworkId`: `"hw-N"` format (N = 1-12)
- `sessionNumber`: 1-indexed integer matching the mission number
- `status`: one of `"draft"`, `"review"`, `"published"`, `"archived"`

### 5. Required Fields

Every mission must have: `missionId`, `sessionNumber`, `title`, `story`, `objectives`, `requiredTasks`, `bonusTasks`, `rewardGE`, `badgeIds`.

Every badge must have: `badgeId`, `name`, `category`, `description`, `icon`.

Every homework must have: `homeworkId`, `missionId`, `title`, `summary`, `requiredTasks`, `estimatedMinutes`, `rewardGE`, `status`.

## Consumption

The web app consumes academy content through the adapter at `apps/web/lib/academyContent.ts`:

```ts
import { canonicalMissions, canonicalBadges, canonicalHomework } from "@/lib/academyContent";
```

Application components must never embed curriculum definitions. They consume
structured content through the adapter. The `materials/` directory contains
teacher-facing lesson assets and supporting prose; it may expand a structured
mission, but it is not an alternative canonical catalog and must reference the
stable mission ID it supports.

## Validation

Run structural validation before committing:

```bash
pnpm validate-curriculum
```

This checks:
- File count and directory structure
- Unique IDs across all content
- Badge references in missions
- Homework → mission references
- Course manifest completeness
- No `as const` on barrel arrays
