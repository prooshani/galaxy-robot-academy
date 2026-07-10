# Component Guidelines

## Shared rules

Every component defines purpose, anatomy, variants/sizes, keyboard/focus behavior, responsive layout, loading/empty/error handling, and forbidden use. Minimum target 44×44px. Status uses label plus icon/color.

## Key components

### Navigation

Brand, primary destinations, active marker, role context, optional menu. Desktop horizontal; mobile explicit disclosure. `aria-current="page"`; logical tab order. Never show inaccessible role destinations or rely on logo as only Home label.

### MissionCard

Session, title, short briefing, status, GE, badge opportunity, primary link. Variants current/upcoming/completed/locked; compact teacher variant. Entire card may be link only when no nested controls. Clamp summary only with accessible full detail. Skeleton matches card; empty mission list uses `EmptyState`.

### BadgeCard

Artwork, name, category, description, earned date/progress. Earned/locked/secret states. Secret badges hide criteria and name when required; screen reader receives “Secret badge, locked.” Never grayscale alone to mean locked.

### GalaxyEnergyMeter / RankProgress

Numeric value, label, track, next threshold. Use native/proper progress semantics with `aria-valuenow/min/max`; include text. Animate only changed fill. GE never decreases. Rank progress must explain remaining amount.

### MissionStatusChip

Statuses: not started, in progress, submitted, awaiting review, needs changes, complete. Small/regular. Icon + human label. Not an action unless rendered as button/select.

### RobotStatusPanel

R0-B0 visual, capability, mood/status, upgrade progress, optional hint. Compact and full variants. Decorative artwork has empty alt; meaningful status is text. Never block core task or give final answers.

### SubmissionCard / ReviewQueue

Student, mission, submitted time, status, code/notes preview, review action. Queue supports filter/sort and meaningful empty/loading/error states. On mobile stack metadata before action. Preserve unsaved review state. Never award GE through ambiguous one-click action.

### DataTable

Caption, headers with scope, body, optional sort/filter/pagination, row actions. Dense/comfortable variants. Provide horizontal containment and accessible sort state. Do not use table for simple card layout; never remove headers visually and semantically.

### Forms / FormSection

Visible label, hint, control, validation, error. Required state in text, not asterisk alone. Group related fields with fieldset/legend. Preserve entries on errors. Loading button retains label and announces state. Mission task lists should use repeatable fields eventually, not comma parsing.

### Dialogs

Title, description, content, primary/secondary actions, close. Confirmation names object and consequence. Initial focus on least destructive sensible control; trap focus; Escape closes unless irreversible operation underway; restore focus.

### CodeSubmissionPanel

Code label, monospace editor/textarea, notes, task completion summary, submit state. Preserve whitespace, allow horizontal scroll, expose error line/context when known. No decorative animation behind code. Never imply code execution when system only stores text.
