# Interaction Guidelines

- Navigation: explicit links, persistent active state, predictable Back destination. No hidden gestures.
- Hover: supplemental only; 120–180ms border/elevation change. Touch users lose nothing.
- Focus: 2px high-contrast ring plus offset; never remove without replacement.
- Active: small press response, no layout shift.
- Disabled: use only when reason is visible; prefer enabled action with validation for forms.
- Loading: show within 150ms if likely perceptible; preserve dimensions; announce longer operations.
- Success: confirm what changed and next step. Do not depend on toast for critical result.
- Error: plain cause, recovery action, field linkage; keep user input.
- Confirmation: required for destructive or hard-to-reverse actions; name mission/submission.
- Mission completion: checklist resolves, status text updates, earned reward summary appears once.
- Badge unlock/GE award: announce amount/name; update persistent totals; celebration cannot block navigation.
- Task checkbox: immediate visible state; optimistic persistence only with rollback/error message.
- Review: teacher selects outcome, feedback, GE, badges, then confirms summary. Prevent duplicate submission.
- Form submit: validate inline, focus first invalid field, set `aria-invalid`/`aria-describedby`, show saved/saving state.

Destructive actions use danger styling only at decision point. Never place Delete as default focused action. Undo is preferred where data model supports it.
