# Page Blueprints

## `/` — Academy Hangar

Objective: understand Academy and continue by role. Hierarchy: brand promise → role-aware continuation → destinations → trust/footer. Desktop uses centered hero and 2×2 destination grid; mobile stacks cards. Primary action Continue/Select role; secondary route cards. Components: AppShell, PageHeader, destination cards, R0-B0 cameo. Subtle hangar light only. Empty role prompts Entry Gate; loading reserves greeting; errors leave public navigation. Ensure one `h1`, descriptive links, restrained hero art.

## `/role` — Academy Entry Gate

Objective: choose student or teacher context knowingly. Two equal portals with role description and privacy note; stack on mobile. Primary actions “Enter as Student Engineer” and “Enter Mission Control”; secondary Home. Components: role cards, Button, confirmation when switching active role. Gate illumination follows focus, not pointer only. Loading disables repeat choice; storage error explains session-only behavior. Cards require buttons/links, not clickable divs.

## `/student` — Explorer Cockpit

Objective: see next mission and progress. Hierarchy: greeting/current mission → GE/rank → R0-B0 → timeline/badges. Desktop main 8 columns + robot 4; mobile current mission first, then progress, robot, history. Primary Open current mission; secondary badges/all missions. Components: GalaxyEnergyMeter, RankProgress, MissionCard, RobotStatusPanel, MissionTimeline. Progress animates once. Empty current mission offers badges; loading skeletons; errors preserve totals if cached. Announce progress numerically.

## `/badges` — Hall of Achievements

Objective: understand earned collection without exposing all secrets. Hierarchy: collection progress → category filters → earned → locked/secret. 3–4 columns desktop, 2 tablet, 1 mobile. Primary inspect badge; secondary filter. Components: BadgeCard, ProgressBar, Chip, EmptyState. Unlock animation once on arrival. Loading keeps grid; error uses retry; zero earned encourages first mission. Locked meaning uses lock/text, not blur alone.

## `/mission/[missionId]` — Engineering Bay

Objective: understand, complete, and submit mission. Hierarchy: status/reward → story/objectives → task checklist → bonus → code/notes → submission. Desktop reading column with optional 280px status rail; mobile single order with sticky submit summary only if non-obscuring. Primary Send transmission; secondary save/return. Components: PageHeader, MissionStatusChip, checklist, CodeSubmissionPanel, Badge/GE preview, Robot hint. Checklist/progress motion only. Not found returns to missions; loading preserves reading width; submission error retains content. Labels, progress semantics, and code keyboard behavior are mandatory.

## `/teacher` — Mission Control

Objective: inspect operations, review work, manage missions. Hierarchy: queue urgency → review queue → mission table → recent outcomes. Desktop dense 12-column dashboard; mobile summary then submission cards, tables scroll only when relationships demand. Primary Review next/Create mission; secondary edit/filter/delete. Components: StatCard, ReviewQueue, SubmissionCard, DataTable, ConfirmationDialog, Toast. No atmospheric movement behind data. Empty queue is positive; loading shows row skeletons; error isolates failed region. Table headers, sort state, dialog focus, and non-color statuses required.

## `/teacher/missions/new` — Mission Planning Console

Objective: create valid mission without losing work. Hierarchy: identity → briefing/objectives → tasks → rewards/badges → review/save. Centered 680px form; mobile same order and full-width actions. Primary Create mission; secondary Cancel. Components: FormSection, inputs, repeatable task fields, badge selector, save status. No celebratory motion until save. Validation inline + summary; submit failure preserves draft; optional local draft recovery. Required meaning, fieldset groups, and first-error focus mandatory.

## `/teacher/missions/[missionId]/edit` — Mission Planning Console

Objective: safely update existing mission. Composition matches create for transfer learning; show mission identity, modified state, and consequence of navigation. Primary Save changes; secondary Cancel; destructive Delete separated into danger zone and confirmation. Components match create plus unsaved-changes dialog. Loading waits for mission; not found returns to Mission Control; conflicts/errors preserve local edits and explain recovery. Announce save result; restore dialog focus; never default focus Delete.

## Cross-route state contract

Every route specifies visible loading, empty, error, success, and permission states. Navigation and page title remain stable during state changes. Student pages use exploratory whitespace; teacher pages use operational density. All mobile compositions preserve information order and primary action clarity.
