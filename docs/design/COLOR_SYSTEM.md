# Color System

Use semantic CSS variables. HSL values support alpha composition; hex is reference. Philosophy: midnight void surfaces, one chromatic brand voice (Signal Violet, rationed), functional state palette. See [Style Reference](STYLE_REFERENCE.md).

## Core tokens

| Token | Hex | HSL | Use |
| --- | --- | --- | --- |
| `space-black` | `#05070F` | `228 50% 4%` | outer canvas (void); tinted, never pure black |
| `deep-space` | `#0A0F1E` | `227 50% 8%` | app background |
| `command-deck` | `#0E1424` | `226 46% 10%` | shell/navigation |
| `panel` | `#131A30` | `226 43% 13%` | cards |
| `elevated-panel` | `#19213C` | `225 38% 17%` | menus/dialogs |
| `signal-violet` | `#AF50FF` | `273 100% 66%` | **primary brand/action** (`--color-brand`); ration like runway lighting |
| `lavender-mist` | `#E1BDFF` | `273 100% 87%` | contrast-safe violet text tint (`--color-halo`), soft washes |
| `nebula-purple` | `#9B7CFA` | `255 91% 73%` | decorative gradient support only |
| `ion-cyan` | `#55DFF5` | `188 89% 65%` | secondary interactive accent (`--color-brand-secondary`), focus ring family |
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
| `text-inverse` | `#0B071D` | on violet/cyan/gold fills |

Borders/effects: hairlines `--hairline-soft rgb(247 249 250 / .12)` and `--hairline-strong rgb(247 249 250 / .24)` are the default separators; `subtle-border`/`strong-border` remain for form controls. `focus-ring #70E7FA` stays cyan — deliberately distinct from brand violet so focus never disappears into brand fills. Glows (`glow-violet`, `glow-cyan`, `glow-purple`) are decorative brand atmosphere, never required state.

## Rationing rules (new)

- Signal Violet per viewport: one filled primary action, one bloom/glow, one accent stroke. Not borders everywhere, not body backgrounds, not paragraphs.
- Ion Cyan is no longer the primary; use it for focus, links in dense teacher surfaces, and rare secondary accents.
- Lavender Mist is the only violet-family tone approved for text on dark panels (11.5:1 on void).

## Contrast rules

Target WCAG 2.2 AA: 4.5:1 normal text, 3:1 large text and meaningful graphics. Dark `text-inverse` on filled violet/cyan/gold buttons (violet fill + `#0B071D` ≈ 4.8:1 — keep button labels bold ≥14px). Pale accent text only on dark panels. Never saturated neon for paragraphs. Validate actual font size/weight and composited alpha. State always includes text or icon, never color alone.
