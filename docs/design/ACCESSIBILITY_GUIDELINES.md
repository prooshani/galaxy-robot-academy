# Accessibility Guidelines

Target WCAG 2.2 AA.

- Use landmarks, one logical `h1`, ordered headings, native buttons/links/forms/tables first.
- Full keyboard access; visible focus; skip link; no keyboard traps except managed modal focus.
- Accessible names describe outcome. Decorative stars/emoji/art use `aria-hidden` or empty alt.
- Contrast: 4.5:1 text, 3:1 large text/UI graphics. Test alpha layers in final composition.
- Status includes words/icons/patterns; color never sole signal.
- Respect reduced motion, 200% zoom, text spacing overrides, and browser font scaling.
- Minimum touch target 44×44px with 8px separation where practical.
- Inputs retain labels. Errors use `aria-invalid`, referenced message, summary for long forms, and focus first invalid field.
- Tables need caption, scoped headers, accessible sorting, and scroll region label. Avoid card conversion that loses relationships.
- Modals: label/description, focus trap, Escape, background inert, focus restoration.
- Live regions: polite for saved/progress/reward; assertive only for blocking errors. Do not announce decorative motion.
- Code inputs use monospace without shrinking below 14px; preserve whitespace and keyboard scrolling.
- Child-friendly readability: short sentences, concrete verbs, 16px body, generous line height, no unexplained acronyms. Explain GE on first encounter.

Verification per redesigned route: keyboard-only pass, screen-reader smoke test, automated axe scan, contrast check, 320px/400% reflow, reduced-motion, touch-target inspection. Automated checks never replace manual review.
