# Typography

## Families

- **Display:** Space Grotesk, `system-ui`, sans-serif. Use via `next/font/google` or self-hosted approved files. Titles only.
- **Heading/body:** Inter, `system-ui`, `-apple-system`, `Segoe UI`, sans-serif. One readable family minimizes load and drift.
- **Code:** JetBrains Mono, `SFMono-Regular`, Consolas, `Liberation Mono`, monospace.

Load with Next.js font integration; expose CSS variables; use `display: swap`. No remote CSS `@import` at runtime. If product avoids external requests, self-host licensed WOFF2.

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
| `label` | 12 / 12 | 1.35 | 600 | technical label |
| `code` | 14 / 15 | 1.65 | 400 | code/input |

Display uses `-0.02em`; headings `-0.01em`; body normal; technical labels `0.08em` uppercase sparingly. Paragraph measure: 55–70 characters, mission brief maximum `68ch`, forms `64ch`, code unrestricted with horizontal overflow. Do not use display font for instructions, tables, forms, or long copy. Respect 200% zoom and user font scaling.
