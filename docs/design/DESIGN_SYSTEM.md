# Design System Architecture

## Layers

Foundations → primitives → composed components → route composition. Tokens live in shared CSS/config; component API is semantic. Page code must not encode new color systems.

### Foundations

- Spacing: 4px base; `1=4`, `2=8`, `3=12`, `4=16`, `5=20`, `6=24`, `8=32`, `10=40`, `12=48`, `16=64`.
- Radius: `sm 6`, `md 10`, `lg 16`, `xl 24`, `pill 9999` px.
- Borders: 1px default, 2px selected/focus reinforcement.
- Elevation: `0` canvas, `1` card, `2` sticky/menu, `3` dialog, `4` toast. Shadows remain broad and low-alpha.
- Opacity: disabled 45%, muted decoration 8–20%, overlay 72%.
- Motion: 120/180/260/420ms; see motion guide.
- Icons: 16/20/24/32px; stroke 1.75–2px.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1440`.
- z-index: canvas 0, content 10, sticky 20, dropdown 30, overlay 40, dialog 50, toast 60.

## Primitives (`packages/ui`)

`Button`, `IconButton`, `Link`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `FormField`, `Label`, `Badge/Chip`, `Tooltip`, `Divider`, `ProgressBar`, `Avatar`. Each owns sizes, variants, focus, disabled, invalid, loading, and accessible semantics. Also shared structural `AppShell`, `Navigation`, `PageHeader`, `EmptyState`, `ConfirmationDialog`, `Toast`, `DataTable`, and `FormSection` when APIs remain domain-neutral.

## Academy compositions (`apps/web/components`)

`MissionCard`, `StatCard`, `BadgeCard`, `GalaxyEnergyMeter`, `RankProgress`, `MissionStatusChip`, `SubmissionCard`, `ReviewQueue`, `RobotStatusPanel`, `RobotUpgradeCard`, `MissionTimeline`, and `CodeSubmissionPanel`. They combine domain language/data with primitives. Promote to `packages/ui` only if domain-neutral through explicit slots/types; do not leak mission logic into shared package.

## Contracts

- Components consume semantic variant names (`status="reviewing"`), not arbitrary color props.
- All interactive primitives forward refs, support keyboard use, and expose accessible names.
- Loading preserves layout; errors sit near source; empty states provide one next action.
- Responsive behavior belongs to component contract, not route patches.
- Business/reward calculations remain outside UI.
