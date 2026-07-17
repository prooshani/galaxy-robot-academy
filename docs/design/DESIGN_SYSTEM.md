# Design System Architecture

Foundations → primitives → composed components → route composition. Tokens live in shared CSS/config; component APIs are semantic. Page code must not create new color, elevation, focus, or state systems.

## Foundations

- Spacing: 4px base; `1=4`, `2=8`, `3=12`, `4=16`, `5=20`, `6=24`, `8=32`, `10=40`, `12=48`, `16=64`.
- Radius: `sm/buttons 8`, `md/inputs 12`, `lg 16`, `xl/cards 20`, `pill 9999` px. Buttons are 8px or pill — nothing between.
- Borders: 1px hairlines are the default separator (`--hairline-soft` rgb(247 249 250 / .12), `--hairline-strong` .24); 2px selected reinforcement. Focus rings do not replace borders. Separation comes from hairlines and luminance, not shadow weight.
- Opacity: disabled 45%, muted decoration 8–20%, modal overlay 72%.
- Motion: 120/180/260/420ms; see [Animation Guidelines](ANIMATION_GUIDELINES.md).
- Icons: 16/20/24/32px; stroke 1.75–2px; decorative icons are hidden from assistive technology.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1440`.
- z-index: canvas 0, content 10, sticky 20, dropdown/tooltip 30, overlay 40, dialog 50, toast 60.
- Accessibility target: WCAG 2.2 AA; see [Accessibility Guidelines](ACCESSIBILITY_GUIDELINES.md).

## Elevation and shadows

Elevation describes physical stacking, not importance, selection, focus, or reward. The system is hairline-first (see [Style Reference](STYLE_REFERENCE.md)): shadows below are ambient softeners, never the primary separator — a surface must still read correctly with its shadow removed. Values are exact canonical CSS tokens.

| Level | Semantic token | Exact `box-shadow` | Intended components | Surface | Border | Overlay relationship |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `--shadow-elevation-0` | `none` | canvas, inset regions, flat controls | `space-black` or `deep-space` | `subtle-border` when boundaries are needed | never creates an overlay |
| 1 | `--shadow-elevation-1` | `0 6px 18px rgb(2 5 16 / 0.18)` | cards, panels, inputs above canvas | `panel` | `subtle-border` | remains in normal content plane |
| 2 | `--shadow-elevation-2` | `0 12px 32px rgb(2 5 16 / 0.24)` | sticky navigation, dropdowns, popovers | `command-deck` or `elevated-panel` | `strong-border` at overlapping edge; otherwise `subtle-border` | may overlap content without dimming it |
| 3 | `--shadow-elevation-3` | `0 20px 48px rgb(2 5 16 / 0.30)` | confirmation dialogs and other modal surfaces | `elevated-panel` | `strong-border` | sits above `rgb(7 11 22 / 0.72)` modal overlay; background is inert |
| 4 | `--shadow-elevation-4` | `0 28px 72px rgb(2 5 16 / 0.36)` | toast region, rare critical transient layer | `elevated-panel` | `strong-border` | above dialogs only when notification must remain available; never obscures dialog actions |

Rules:

- Use the lowest level that communicates overlap. Do not increase elevation on hover; a card may translate 2px while retaining level 1.
- Focus is `0 0 0 3px #70E7FA` outside the component, separated by a 2px canvas-colored gap when adjacent colors reduce clarity. Focus remains visible over every elevation.
- Glow is decorative brand atmosphere (`glow-violet`, `glow-cyan`, `glow-purple` in [Color System](COLOR_SYSTEM.md)); never indicates focus, selection, validation, or stacking. One component must not combine two glows; one viewport carries at most one violet bloom.
- Selected, checked, expanded, and invalid states use semantic border, icon, label, and/or surface changes without changing elevation.
- Shadows stay broad, low-alpha, and neutral. No hard black outlines, white shadows, colored drop shadows, or stacked multi-shadow “neon” borders.
- Dark-theme separation must not depend on shadow alone. Adjacent surfaces require a border and sufficient luminance difference. Validate composited text and meaningful graphics at WCAG AA contrast.

## Ownership and shared contracts

All contracts below are owned by `packages/ui` when domain-neutral. They forward refs where the platform supports refs, accept semantic variants rather than arbitrary colors, preserve layout while loading, and expose native element props without permitting contracts to be bypassed. Academy-specific content and business rules remain in `apps/web/components`.

State names below apply only where meaningful. “Unavailable” states must not be added to components that cannot express them semantically.

### Button

- **Purpose/anatomy:** commits an immediate action; container, visible label, optional leading/trailing icon, optional loading indicator.
- **Variants/sizes:** `primary`, `secondary`, `ghost`, `danger`; `sm` 36px only in dense desktop tables, `md` 44px default, `lg` 48px. Touch targets remain at least 44×44px.
- **States:** default; hover increases surface/border contrast; active compresses visually without moving layout; focus-visible uses canonical ring; disabled preserves label at 45% and removes pointer action; loading retains width/label, disables repeat activation, and exposes busy state. No selected, checked, expanded, invalid, or read-only state unless the component is explicitly a toggle, in which case use a dedicated toggle contract.
- **Keyboard/ARIA:** native `<button>`; Space/Enter activates; `type` is explicit. Accessible name comes from visible label or required `aria-label` for icon-only use. Loading uses `aria-busy="true"`; status announcement is polite and separate. Disabled uses native `disabled` when unavailable.
- **Responsive/failure:** labels may wrap once; paired actions stack full-width below 400px with primary first visually but logical order preserved. An action error appears near the initiating control or in a toast; never replace the label with an unlabeled spinner.
- **Forbidden:** navigation, clickable containers, destructive action styled as primary, color-only state, more than one primary action per decision group.

### IconButton

- **Purpose/anatomy:** compact action with 20–24px icon inside a minimum 44px target; optional tooltip.
- **Variants/sizes:** same semantic variants as Button; 44px default, 36px visible control only when its hit area remains 44px.
- **States:** Button states apply. Expanded menu controls additionally expose expanded/collapsed; toggle IconButtons expose pressed/unpressed. No invalid or read-only state.
- **Keyboard/ARIA:** native button; required accessible name not duplicated by decorative icon; `aria-expanded` + `aria-controls` for disclosure, `aria-pressed` for toggle. Tooltip never supplies the only accessible name.
- **Responsive/failure:** keep target size on mobile; if meaning is unfamiliar, switch to labeled Button. Loading swaps icon for indicator while accessible name retains action.
- **Forbidden:** unlabeled icon, ambiguous destructive icon, icon-only primary form submission.

### Link

- **Purpose/anatomy:** navigates to a resource; text label, optional external/leading/trailing icon.
- **Variants/sizes:** `inline`, `navigation`, `standalone`, `subtle`; typography follows surrounding context, with 44px target for standalone/navigation links.
- **States:** default, hover underline or stronger contrast, active route where applicable, focus-visible, visited only for external editorial content, disabled only when rendered as non-link text with explanation. Loading, invalid, checked, selected, and read-only do not apply; active route is not pressed state.
- **Keyboard/ARIA:** native anchor with valid `href`; Enter activates. Accessible name describes destination. Current route uses `aria-current="page"`; external new-window links disclose behavior in visible or accessible text.
- **Responsive/failure:** wrap meaningful text; truncate only with an equivalent full accessible name. Broken/unavailable destinations must not remain actionable.
- **Forbidden:** action submission, empty `href`, click handlers on spans, “click here,” disabled anchor that still navigates.

### Input and Textarea

- **Purpose/anatomy:** Input captures one-line values; Textarea captures multi-line prose/code. Control is composed through FormField with Label, optional hint, count, and error.
- **Variants/sizes:** standard; code Textarea uses approved mono font. `sm` 40px for dense desktop filters, `md` 44px default, `lg` 48px. Textarea minimum 120px and vertically resizable.
- **States:** default, hover border, active caret, focus-visible ring, disabled, read-only, invalid, and loading only when surrounding FormField is awaiting a value. No selected/checked/expanded state. Preserve entered value on error.
- **Keyboard/ARIA:** native input/textarea; visible associated Label. Use correct `type`, `inputMode`, and `autocomplete`. Invalid uses `aria-invalid="true"` and `aria-describedby` pointing to error; read-only uses `readonly`, not disabled. Textarea Enter creates a line; code entry preserves whitespace and keyboard scrolling.
- **Responsive/failure:** width fills form column; never force page overflow. Error and hint wrap below control. Loading may use a same-size skeleton before control exists, never an editable-looking inert field.
- **Forbidden:** placeholder as label, clearing invalid data, disabling paste, tiny fixed-height code fields, unexplained character limits.

### Select

- **Purpose/anatomy:** chooses one or more values from a bounded set; Label, trigger/native control, value, chevron, option list.
- **Variants/sizes:** native Select preferred; `sm` 40px desktop filter, `md` 44px, `lg` 48px. Semantic visual variants are neutral and invalid only.
- **States:** default, hover, active/open, focus-visible, disabled, invalid, expanded, selected option, and read-only represented as labeled text because HTML select has no read-only state. Loading reserves size and disables opening with a status message. Checked does not apply.
- **Keyboard/ARIA:** native keyboard behavior where possible. Custom listbox requires trigger `aria-expanded`, `aria-controls`, active descendant/roving focus, Escape close, arrows move, Home/End, typeahead, Enter/Space select. Label and error references are mandatory.
- **Responsive/failure:** menu stays within viewport and may open upward; long labels wrap or truncate with full accessible value. Empty options show “No options available”; load failure gives retry outside the list.
- **Forbidden:** custom select without complete keyboard semantics, placeholder-only label, options distinguished only by color.

### Checkbox and Radio

- **Purpose/anatomy:** Checkbox selects independent boolean/multiple values; Radio selects exactly one value in a named group. Native control, visible label, optional description/error.
- **Variants/sizes:** 20px visual control within 44px label target; neutral, invalid, and domain-neutral status styling.
- **States:** default, hover on target, active, focus-visible, disabled, invalid, checked/unchecked; Checkbox may be indeterminate. Radio has selected/unselected. Read-only is rendered as non-interactive labeled status; loading disables the group with a group status. Expanded does not apply.
- **Keyboard/ARIA:** native controls preferred. Space toggles Checkbox; arrows move and select Radio within group, Tab enters/exits group. Radio group uses `<fieldset><legend>` or `role="radiogroup"` with name. Errors reference group or field. Indeterminate state remains explicitly described.
- **Responsive/failure:** label wraps and remains clickable; groups stack on narrow screens unless compact choices remain readable. Empty Radio options explain unavailable choices.
- **Forbidden:** custom div controls, hidden focus, one Checkbox pretending to be mutually exclusive, color-only checked state.

### Switch

- **Purpose/anatomy:** changes an immediately applied binary setting; track, thumb, visible label, optional description.
- **Variants/sizes:** one 44px target; neutral/off and semantic on state, never danger as decoration.
- **States:** default, hover, active, focus-visible, disabled, checked, and loading during persistence. Invalid applies only when saving the setting failed; read-only becomes labeled status. Selected and expanded do not apply.
- **Keyboard/ARIA:** native checkbox with switch presentation or `role="switch"`; Space toggles; label required; `aria-checked` reflects state. Optimistic updates must revert and announce save failure.
- **Responsive/failure:** label takes remaining width; control does not shrink. Error appears below group; loading does not oscillate.
- **Forbidden:** submitting a form, multi-option choice, irreversible action, unlabeled on/off state.

### Label and FormField

- **Purpose/anatomy:** Label names one control. FormField composes Label, required/optional text, hint, control slot, metadata, and error.
- **Variants/sizes:** standard and compact metadata density; no visual status variants beyond invalid/disabled/read-only inherited from control.
- **States:** default, disabled association, invalid, read-only, and loading. Hover/active/selected/checked/expanded belong to contained control, not FormField.
- **Keyboard/ARIA:** Label uses `for`/`htmlFor`; group labels use legend. Required is visible text plus native `required`/`aria-required` where needed. Hint/error IDs are stable and included in `aria-describedby`; error uses polite live announcement after validation.
- **Responsive/failure:** label and messages wrap; field remains one logical unit. Loading skeleton preserves full unit. Error never displaces another field unexpectedly on submit when preventable.
- **Forbidden:** asterisk-only required meaning, duplicate labels, error conveyed only in summary, helper text used as accessible name.

### Badge/Chip

- **Purpose/anatomy:** compact status/category/value; optional icon, label, optional remove action. “Badge” here is UI metadata, not Academy achievement content.
- **Variants/sizes:** neutral, info, success, warning, danger, locked, submitted; `sm` 24px and `md` 32px. Interactive filter chips use separate pressed-button semantics.
- **States:** static Badge has no hover/active/focus. Interactive Chip has default, hover, active, focus-visible, disabled, selected/pressed, and loading if filter results are pending. Invalid, checked, expanded, read-only do not apply.
- **Keyboard/ARIA:** static uses text; status includes icon + human label. Interactive uses button with `aria-pressed`; removable chip exposes a separately named remove button.
- **Responsive/failure:** wrap groups; do not shrink text below 12px. Overflow may collapse to “+3” with accessible full list. Empty status is omitted, not rendered blank.
- **Forbidden:** status by color alone, hidden critical copy, tiny chip as sole primary action, achievement Badge logic in shared primitive.

### Tooltip

- **Purpose/anatomy:** brief supplemental explanation anchored to a focused/hovered control; bubble and optional pointer.
- **Variants/sizes:** one neutral elevated style; maximum 32ch.
- **States:** hidden/default and expanded/visible; no disabled, loading, invalid, checked, selected, or read-only state. Appears on hover and keyboard focus after 300–500ms; dismisses without delay.
- **Keyboard/ARIA:** trigger remains independently named. Tooltip uses `role="tooltip"` and `aria-describedby`; Escape dismisses; hoverable content remains available when pointer moves onto it.
- **Responsive/failure:** repositions within viewport; on touch, persistent help text or explicit info disclosure replaces hover dependency.
- **Forbidden:** essential instructions, interactive controls, long prose, error messages, tooltip as only accessible name.

### Divider

- **Purpose/anatomy:** separates related regions visually; horizontal/vertical line with optional text label.
- **Variants/sizes:** subtle and strong; 1px. Decorative divider is hidden from assistive technology; semantic thematic break uses `<hr>`.
- **States/behavior:** no interactive, loading, invalid, selected, checked, expanded, disabled, or read-only states; no keyboard behavior.
- **Responsive/failure:** vertical divider becomes horizontal when layout stacks. Omit rather than render an empty separator.
- **Forbidden:** replacing spacing hierarchy, high-contrast decoration between every item, focusable separator.

### ProgressBar

- **Purpose/anatomy:** label, track, fill, current/maximum text, optional remaining text.
- **Variants/sizes:** neutral, brand, success, warning; `sm` 6px, `md` 10px, with visible numeric text regardless of track size.
- **States:** determinate, indeterminate loading, complete, and error in adjacent text. No hover, active, focus, disabled, selected, checked, expanded, invalid, or read-only state unless embedded in an interactive control.
- **Keyboard/ARIA:** non-focusable `role="progressbar"` with name and `aria-valuemin/max/now`; indeterminate omits `aria-valuenow` and includes loading text. GE never decreases; rank progress explains remaining GE.
- **Responsive/failure:** track fills container, text wraps, value remains visible at 320px. Under reduced motion, fill changes instantly or fades ≤100ms.
- **Forbidden:** progress without numbers, fake precision, using progress as a slider, color-only completion.

### Avatar

- **Purpose/anatomy:** person/robot identity image or initials fallback, optional status badge outside image.
- **Variants/sizes:** circle or approved robot silhouette; 24/32/40/56/80px. Status color always has text elsewhere.
- **States:** default, image-loading placeholder, image error fallback, optional selected state only inside a picker with explicit control semantics. No hover/active/focus/disabled unless wrapped in an interactive element; no invalid, checked, expanded, or read-only state.
- **Keyboard/ARIA:** decorative beside visible name uses empty alt; identity-only image uses concise alt. Interactive avatar is wrapped in Button/Link with its own name.
- **Responsive/failure:** fixed aspect ratio; fallback initials or compact R0-B0 module mark. Never shift layout when image loads.
- **Forbidden:** initials derived from sensitive data, status conveyed solely by dot, Avatar itself as unlabelled control.

## Shared structural contracts

### AppShell and Navigation

- **Ownership/purpose/anatomy:** `packages/ui` owns domain-neutral shell slots; `apps/web/components` supplies Academy brand, role, and destinations. AppShell provides skip link, banner/navigation slot, main landmark, background layers, optional footer/toast region. Navigation contains brand Home link, destinations, active marker, role context, and mobile disclosure.
- **Variants/sizes:** general and teacher content widths from [Layout System](LAYOUT_SYSTEM.md); navigation 64px desktop, 72px minimum mobile.
- **States:** default, sticky/scrolled, active route, focus-visible links, mobile expanded/collapsed, loading identity placeholder, permission-filtered destinations. Disabled navigation links are removed or explained as locked non-links. Invalid/checked/read-only do not apply.
- **Keyboard/ARIA:** one `nav` named “Primary navigation”; logical order; skip link first; `aria-current="page"`; menu button uses `aria-expanded`/`aria-controls`, Escape closes and restores focus. No focus trap in mobile navigation.
- **Responsive/failure:** desktop horizontal at supported width; explicit menu below breakpoint; no hidden gesture; safe areas honored. Loading keeps navigation stable. Route error still preserves public navigation.
- **Forbidden:** inaccessible role links, logo as only Home label, horizontal overflow, content hidden behind sticky header, decorative movement behind forms/code.

### PageHeader

- **Ownership/purpose/anatomy:** `packages/ui`; optional eyebrow/breadcrumb/back link, single page `h1`, description, status/reward metadata, primary/secondary actions.
- **Variants/sizes:** standard, reading, dense teacher; heading follows typography tokens.
- **States:** stable during page loading/error; actions inherit their own states. No intrinsic hover, active, selected, checked, expanded, invalid, or read-only state.
- **Keyboard/ARIA:** exactly one logical `h1`; back control is a Link with destination name; metadata uses text, not decorative icons alone.
- **Responsive/failure:** actions wrap then stack full-width on narrow screens; title never truncates essential mission identity. Loading skeleton preserves header height; error keeps title/context.
- **Forbidden:** multiple `h1`s, unlabeled back chevron, route-specific arbitrary spacing.

### EmptyState

- **Ownership/purpose/anatomy:** `packages/ui`; optional decorative icon/illustration, title, concise explanation, one primary next action, optional secondary link.
- **Variants/sizes:** compact region and full-page; neutral or positive, never alarm styling for a valid empty state.
- **States:** empty only; action states belong to Button/Link. Loading and error are separate components, not EmptyState variants.
- **Keyboard/ARIA:** heading level fits context; decorative art hidden; action name states outcome. No live announcement unless emptiness results from user filtering.
- **Responsive/failure:** centered within region; actions stack under 400px. No empty container when guidance is unavailable.
- **Forbidden:** blame, dead end, fake error, more than two competing actions, R0-B0 blocking content.

### ConfirmationDialog

- **Ownership/purpose/anatomy:** `packages/ui`; modal overlay, title, consequence description, optional object summary, Cancel, explicit confirm action, optional close.
- **Variants/sizes:** standard and danger; maximum readable width 520px; elevation 3.
- **States:** closed/open, focus-visible controls, confirm loading/disabled, action error retained in dialog. Expanded maps to open state. Invalid, selected, checked, and read-only do not apply.
- **Keyboard/ARIA:** semantic dialog with `aria-modal="true"`, labelled title and described consequence; initial focus on Cancel or safest sensible action; Tab trapped; Escape closes unless irreversible action is underway; closing restores trigger focus; background inert.
- **Responsive/failure:** inset 16px from viewport, internal scroll if needed, actions stack on narrow screens. Loading retains label and prevents duplicate submit; error preserves context and offers retry/cancel.
- **Forbidden:** default focus on Delete, vague “Are you sure?”, irreversible action without named object/consequence, nesting dialogs.

### Toast

- **Ownership/purpose/anatomy:** `packages/ui`; status icon, concise title/message, optional single action, dismiss button; managed toast region.
- **Variants/sizes:** info, success, warning, danger; maximum width 420px; elevation 4.
- **States:** entering, visible, paused, dismissing; action focus-visible; loading only if its action is pending. No disabled, selected, checked, expanded, invalid, or read-only state.
- **Keyboard/ARIA:** success/info use polite `status`; blocking danger may use assertive `alert`. Do not move focus automatically. Dismiss and action are named; timer pauses on hover/focus. Critical errors remain inline as well.
- **Responsive/failure:** top/right desktop, top inset mobile; never covers navigation, dialog actions, or submit controls; stack maximum three. Reduced motion uses ≤100ms fade. Queue overflow summarizes rather than flooding.
- **Forbidden:** only record of destructive failure, long instructions, auto-dismiss before reading, reward animation loop.

### DataTable

- **Ownership/purpose/anatomy:** `packages/ui`; caption, optional toolbar, table, header/body rows, sort controls, selection cells, row actions, pagination, empty/loading/error region.
- **Variants/sizes:** comfortable 48px rows; dense 40px only for teacher desktop. Domain status cells compose Badge/Chip.
- **States:** default, row hover, keyboard focus within controls, selected rows with checkbox + surface, sorted column, loading skeleton rows, empty, region error, disabled row action. Invalid/read-only apply only to embedded controls; expanded row uses button with `aria-expanded`.
- **Keyboard/ARIA:** native table; visible or screen-reader caption; `scope="col/row"`; sort button and `aria-sort`; checkbox labels identify row; actions identify object. Horizontal scroll container is keyboard accessible and named when necessary.
- **Responsive/failure:** preserve relationships; scroll horizontally before converting. Card conversion requires explicit labels and identical information order. Sticky identity/action columns only when they do not obscure data. Loading keeps headers; error isolates failed region; empty uses EmptyState.
- **Forbidden:** table for simple card layout, headers removed semantically, row click with nested controls, color-only selection/status.

### FormSection

- **Ownership/purpose/anatomy:** `packages/ui`; section heading/legend, optional description, grouped FormFields, section-level error, optional action slot.
- **Variants/sizes:** standard 64ch/680px and compact teacher subsection; spacing follows tokens.
- **States:** default, disabled group, read-only, loading skeleton, invalid summary, optional collapsed/expanded only when content is nonessential and disclosure is explicit. Selected/checked belong to child controls.
- **Keyboard/ARIA:** use `fieldset/legend` for related choices, otherwise section + heading. Error summary links/focuses fields; first invalid field receives focus after failed submit. Disabled fieldset uses native semantics; read-only keeps content readable.
- **Responsive/failure:** one column mobile; approved paired short fields may use two columns desktop. Loading preserves draft geometry; errors never clear entries; empty repeatable group provides a named Add action.
- **Forbidden:** visual grouping without semantic grouping, comma-parsed repeatable tasks as target pattern, hidden required fields, section collapse that conceals errors.

## Academy compositions (`apps/web/components`)

`MissionCard`, `StatCard`, `BadgeCard`, `GalaxyEnergyMeter`, `RankProgress`, `MissionStatusChip`, `SubmissionCard`, `ReviewQueue`, `RobotStatusPanel`, `RobotUpgradeCard`, `MissionTimeline`, and `CodeSubmissionPanel` combine Academy language/data with primitives. Promote to `packages/ui` only if domain-neutral through explicit slots/types. Business, reward, progression, permission, and mission calculations never belong in shared UI.
