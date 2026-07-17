# Typography

Four voices (see [Style Reference](STYLE_REFERENCE.md)): geometric display, readable workhorse, stamped mono signposts, rare italic serif drama.

## Families

- **Display:** Space Grotesk, `system-ui`, sans-serif (`--font-display`). Titles and hero headings only.
- **Heading/body:** Inter, `system-ui`, `-apple-system`, `Segoe UI`, sans-serif (`--font-sans`). One readable family minimizes load and drift.
- **Mono / stamp:** JetBrains Mono, `SFMono-Regular`, Consolas, monospace (`--font-mono`). Two jobs: code (normal tracking) and stamped section labels via `.stamp-label` (uppercase, `0.2em` tracking, weight 400).
- **Serif display:** Lora Italic (`--font-serif-display`, `.display-serif`). Hero echo lines only, ≥32px, maximum two–three moments per page. Never body, nav, forms, or beside a stamp label on the same line.

Load with `next/font/google`; expose CSS variables; `display: swap`. No remote CSS `@import` at runtime.

## Scale

| Token | Mobile / desktop | Line height | Weight | Use |
| --- | --- | --- | --- | --- |
| `display-xl` | 40 / 64 | 1.05 | 700 | home hero only |
| `display-lg` | 32 / 48 | 1.1 | 700 | major milestone |
| `heading-1` | 28 / 36 | 1.15 | 700 | page title |
| `heading-2` | 22 / 28 | 1.25 | 650 | section |
| `heading-3` | 18 / 20 | 1.3 | 600 | card |
| `body-lg` | 18 / 18 | 1.6 | 400 | briefing lead |
| `body` | 16 / 16 | 1.55 | 400 | default |
| `body-sm` | 14 / 14 | 1.5 | 400/500 | metadata |
| `stamp` | 12–14 / 12–24 | 1.2 | 400 | mono section labels, `0.2em` tracking, uppercase |
| `stamp-lg` | 20 / 32 | 1.1 | 400 | section signpost headings (source style's "74px stamp", scaled for kids) |
| `serif-display` | 32 / 40–56 | 1.15 | 500 italic | hero echo lines |
| `code` | 14 / 15 | 1.65 | 400 | code/input |

Display uses `-0.02em`; headings `-0.01em`; body normal; stamp labels `0.2em` (`--tracking-stamp`) — the tracking is the design, no underline or decoration. Old bold-uppercase eyebrows (`tracking .14–.18em`, weight 700) are deprecated in favor of `.stamp-label`. Paragraph measure: 55–70 characters, mission brief maximum `68ch`, forms `64ch`, code unrestricted with horizontal overflow. Do not use display or serif fonts for instructions, tables, forms, or long copy. Respect 200% zoom and user font scaling.
