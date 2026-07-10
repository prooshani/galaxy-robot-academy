# Color System

Use semantic CSS variables. HSL values support alpha composition; hex is reference.

## Core tokens

| Token | Hex | HSL | Use |
| --- | --- | --- | --- |
| `space-black` | `#070B16` | `222 52% 6%` | outer canvas; avoid pure black |
| `deep-space` | `#0B1022` | `229 51% 9%` | app background |
| `command-deck` | `#10182E` | `223 48% 12%` | shell/navigation |
| `panel` | `#151F38` | `220 45% 15%` | cards |
| `elevated-panel` | `#1B2947` | `218 45% 19%` | menus/dialogs |
| `nebula-purple` | `#9B7CFA` | `255 91% 73%` | secondary brand |
| `ion-cyan` | `#55DFF5` | `188 89% 65%` | primary interactive accent |
| `stellar-blue` | `#6EA8FF` | `216 100% 72%` | information/navigation |
| `solar-gold` | `#F6C85F` | `42 89% 67%` | rewards/GE |
| `plasma-orange` | `#F29A5A` | `25 85% 65%` | priority/bonus |

## State and text

| Token | Hex | Pairing |
| --- | --- | --- |
| `success` / `completed` | `#65D69E` | icon + “Complete” |
| `warning` / `reviewing` | `#F3C969` | clock + “In review” |
| `danger` | `#FF7B88` | icon + error copy |
| `info` | `#73B7FF` | info icon + label |
| `locked` | `#77829B` | lock + “Locked” |
| `submitted` | `#D6A8FF` | upload/check + “Submitted” |
| `text-primary` | `#F3F7FF` | main text |
| `text-secondary` | `#C2CCE0` | supporting text |
| `text-muted` | `#8E9AB4` | metadata; never essential tiny copy |
| `text-disabled` | `#68738A` | disabled only |
| `text-inverse` | `#07101D` | on light accent fills |

Borders/effects: `subtle-border #2A3857`, `strong-border #496186`, `focus-ring #70E7FA`. `glow-cyan: 0 0 24px rgb(85 223 245 / .18)` and `glow-purple: 0 0 28px rgb(155 124 250 / .16)` are decorative, never required state.

## Contrast rules

Target WCAG AA: 4.5:1 normal text, 3:1 large text and meaningful graphics. Use dark text on filled cyan/gold buttons; pale accent text only on dark panels. Never use saturated neon for paragraphs. Validate actual font size/weight and composited alpha. State always includes text or icon, never color alone.
