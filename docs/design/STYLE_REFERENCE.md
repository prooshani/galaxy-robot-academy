# Galaxy Robot Academy — Style Reference
> Midnight academy with violet beacons

**Theme:** dark · **Source inspiration:** dope.security extended style extraction (refero.design `e1f18a7e`), adapted for a 9–12 learning product.

The academy is a midnight-void interface with one chromatic voice. The canvas is a blue-violet tinted near-black (never pure `#000`); color is rationed — Signal Violet appears as the primary action, one glow, and one accent per viewport, the way runway lighting marks a path. Surfaces are flat; elevation comes from 1px hairline strokes and translucent washes, not heavy shadows. Typography pairs a geometric display sans (Space Grotesk) with a mechanical stamped mono voice (JetBrains Mono, extreme tracking) for section signposts, and a warm italic serif (Lora) reserved for two or three hero moments. Unlike the source style, the academy keeps its semantic state palette (success/warning/danger/info/energy) because children need unambiguous feedback — states are functional color, not decoration.

## Tokens — Colors

| Name | Value | Token | Role |
| --- | --- | --- | --- |
| Space Black (Void) | `#05070F` | `--space-black` | Page canvas — the void everything floats in; blue-violet tinted, never pure black |
| Deep Space | `#0A0F1E` | `--deep-space` | App background gradient partner |
| Command Deck | `#0E1424` | `--command-deck` | Shell / frosted navigation base |
| Panel | `#131A30` | `--panel` | Cards and reading surfaces |
| Elevated Panel | `#19213C` | `--elevated-panel` | Menus, dialogs |
| Signal Violet | `#AF50FF` | `--signal-violet` → `--color-brand` | The single chromatic voice: primary action fill, one feature glow, accent strokes. Rationed, never a theme wash |
| Lavender Mist | `#E1BDFF` | `--lavender-mist` → `--color-halo` | Contrast-safe violet-tinted text and soft washes paired with Signal Violet |
| Nebula Purple | `#9B7CFA` | `--nebula-purple` | Soft support tint for decorative gradients only |
| Ion Cyan | `#55DFF5` | `--ion-cyan` → `--color-brand-secondary` | Secondary interactive accent and focus ring; rationed harder than before |
| Solar Gold | `#F6C85F` | `--solar-gold` | Galaxy Energy / rewards (functional) |
| State palette | unchanged | `--success` `--warning` `--danger` `--info` `--locked` `--submitted` | Feedback stays semantic; see [Color System](COLOR_SYSTEM.md) |

## Tokens — Typography

### Space Grotesk — display voice · `--font-display`
- Substitute stand-in for the source's Whyte Inktrap: geometric, slightly warm, technical.
- Weights 500–700; page titles, hero headings, card titles.
- Tracking tight on display: `-0.02em`.

### Inter — workhorse · `--font-sans`
- Body, nav, buttons, forms. Weights 400–700. Line height 1.5–1.6.

### JetBrains Mono — stamped signpost voice · `--font-mono` + `.stamp-label`
- The mechanical "boarding pass" voice: uppercase, `letter-spacing: 0.2em` (`--tracking-stamp`), weight 400.
- Replaces plain uppercase eyebrows on section labels: `MISSION BRIEFING`, `COMPANION STATUS`.
- Scaled for a kids' product: 12–24px labels, up to 32px section stamps — never the 74px of the source.
- Also remains the code voice; code blocks keep normal tracking.

### Lora Italic — hero drama · `--font-serif-display` + `.display-serif`
- Substitute for the source's GrandSlang italic. Reserved for at most two or three display moments per page (hero echo lines), 32px minimum, never body/nav/forms.

Scale, sizes, and responsive values: see [Typography](TYPOGRAPHY.md).

## Tokens — Spacing & Shapes

- Base unit 4px; scale unchanged (see [Design System](DESIGN_SYSTEM.md)).
- **Radius:** `--radius-buttons: 8px`, `--radius-md: 12px` (inputs), `--radius-cards: 20px`, `--radius-pill: 9999px` (chips, pill CTAs). Buttons are 8px or pill — nothing between.
- **Hairlines:** `--hairline-soft: rgb(247 249 250 / .12)`, `--hairline-strong: rgb(247 249 250 / .24)`. 1px strokes replace shadows for separation.
- **Shadows:** one soft ambient (`--shadow-panel`) and rationed glows (`--shadow-glow-violet`, `--shadow-glow-cyan`). Never stack glows; never use shadow to signal state.

## Components (style deltas)

### Frosted Nav Bar
Sticky top bar on translucent command-deck wash + `backdrop-blur`, 1px bottom hairline. Brand = badge mark + wordmark (see `apps/web/public/brand`). Nav labels stay Inter semibold; role chip is a pill.

### Stamped Section Label
`.stamp-label` — JetBrains Mono, uppercase, 0.2em tracking, Lavender Mist or muted text. Replaces bold uppercase eyebrows above sections and cards. The tracking is the design; no underline, no decoration.

### Primary Action (Violet Fill)
Signal Violet fill, dark inverse text, 8px radius (or pill for hero CTA), subtle violet glow. Maximum one per decision group; the glow appears only on the page's primary CTA.

### Hairline Card
Panel wash + 1px `--hairline-soft` border, 20px radius. Hover raises border contrast (`--hairline-strong`) and translates 2px — elevation level does not change.

### Violet Bloom Feature
One card per page may carry the violet radial bloom (`--shadow-glow-violet` + brand gradient wash) — the "next mission" hero. When violet blooms everywhere it stops meaning anything.

### Coordinate Footer (pattern, optional)
Full-width band, hairline top border, stamp-label mission coordinates (`SESSION 04 · SECTOR R0-B0`) left, Galaxy Energy state right. The brand signs the page like a postcard from deep space.

## Do's and Don'ts

### Do
- Ration Signal Violet: one filled action, one glow/bloom, one accent stroke per viewport.
- Use `.stamp-label` mono tracking for section signposts and technical eyebrows.
- Default cards to 20px radius + 1px hairline; let spacing create boundaries.
- Keep the semantic state palette fully saturated in meaning: state always pairs color with icon/text.
- Use Lora italic only ≥32px for hero echoes.
- Keep the frosted nav: translucent wash + blur + 1px hairline bottom.

### Don't
- Don't add box-shadows for hierarchy — hairlines and luminance do that work.
- Don't use Signal Violet for body text or long backgrounds; Lavender Mist is the text-safe tint.
- Don't mix the stamp mono voice and the serif italic on the same line.
- Don't introduce new accent hues; the palette is surfaces + one violet voice + functional states.
- Don't drop below WCAG 2.2 AA — the source style's luxury restraint never outranks a child reading the screen.
- Don't make the interface pure black or pure white; the void is tinted.

## Surfaces

| Level | Name | Value | Purpose |
| --- | --- | --- | --- |
| 0 | Void Canvas | `#05070F` | Full-bleed page background |
| 1 | Frosted Deck | command-deck @ ~85% + blur | Sticky navigation |
| 2 | Panel Wash | panel/elevated gradients | Cards, dialogs |
| 3 | Violet Bloom | `#AF50FF` glow/wash | One feature moment per page |

## Layout

1200–1280px content max-width, generous section gaps (~96–120px on marketing-style pages, denser for teacher ops), left-aligned reading, no multi-column body text. Full-bleed dark bands separated by rhythm and stamped labels, not divider decoration.

## Quick Reference

- text: `#F7FAFF` (`--text-primary`)
- background: `#05070F` (`--space-black`)
- border: `--hairline-soft`
- accent / primary action: `#AF50FF` (`--signal-violet`)
- accent text tint: `#E1BDFF` (`--lavender-mist`)
- focus ring: `#70E7FA` (cyan — intentionally distinct from brand violet)
- muted text: `--text-muted`

Implementation lives in `apps/web/app/globals.css`. Logo assets: `apps/web/public/brand/` and [Brand Guide](BRAND_GUIDE.md).
