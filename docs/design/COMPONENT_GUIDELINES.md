# Component Guidelines

## Shared rules

Normative primitive and structural contracts live in [Design System Architecture](DESIGN_SYSTEM.md). This document defines Academy compositions and integration rules. Every composition declares ownership, purpose, anatomy, semantic variants/sizes, applicable states, keyboard/focus behavior, accessible name and ARIA requirements, responsive layout, loading/empty/error handling, and forbidden use. Minimum target is 44×44px. Status always uses human text plus icon and/or color.

Composition rules:

- Compose shared primitives; do not restyle native controls route by route.
- Keep mission, reward, badge, role, and progression rules outside presentation components.
- A composition may map domain status to a semantic primitive variant, but must not pass arbitrary colors.
- Loading preserves geometry; errors stay near their source; empty states provide one useful next action.
- State changes never remove user-entered code, notes, review feedback, or mission form data.
- Reduced-motion and focus behavior inherit foundation contracts and remain testable at 320px and 400% zoom.

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

Shared DataTable contract is defined in [Design System Architecture](DESIGN_SYSTEM.md#datatable). Academy tables supply mission/student labels, human-readable status, and domain actions. Caption, scoped headers, sorting, selection, pagination, loading rows, empty state, and region error remain owned by the shared primitive. Do not use a table for simple card layout; never remove headers visually or semantically.

### Forms / FormSection

Shared FormField/FormSection contracts are defined in [Design System Architecture](DESIGN_SYSTEM.md#formsection). Academy forms provide mission-specific labels, validation messages, task-row composition, reward and badge selectors. Preserve entries on every error. Mission task lists use repeatable fields as the target design, not comma parsing.

### Dialogs

Shared ConfirmationDialog contract is defined in [Design System Architecture](DESIGN_SYSTEM.md#confirmationdialog). Academy confirmation copy names the mission, submission, badge, or role and states its consequence. Domain components provide copy and callbacks only; focus, overlay, inert background, Escape behavior, loading, error, and focus restoration remain primitive responsibilities.

### CodeSubmissionPanel

Code label, monospace editor/textarea, notes, task completion summary, submit state. Preserve whitespace, allow horizontal scroll, expose error line/context when known. No decorative animation behind code. Never imply code execution when system only stores text.
