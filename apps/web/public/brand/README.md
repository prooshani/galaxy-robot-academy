# Galaxy Robot Academy — Brand Assets

**Canonical artwork is the provided master `logo-original.png`** — product UI must use it (via the derived transparent crops), never a redrawn variation. The SVG recreations below are auxiliary only (favicon + large-print fallback). Never restyle logo colors with CSS filters.

## Files

| Asset | Use |
| --- | --- |
| `logo-original.png` | Provided master (lavender background), untouched reference. |
| `logo.png` | Master with background removed — full lockup (badge + wordmark), transparent. Wordmark is ink indigo: light surfaces. |
| `logo-badge.png` | Badge head only (no text), transparent — nav, footer, hero, avatars. Used by `components/Logo.tsx`. |
| `logo-rocket.svg` | Favicon / app icon voice: gradient rocket redrawn as vector, no text, no background. Same art as `apps/web/app/icon.svg`. |
| `logo-mark.svg`, `logo-full*.svg`, `logo-horizontal*.svg` | Auxiliary vector recreations for large print/social where the 324px raster is too small. Prefer the PNG masters in-product. |
| `png/rocket-{16,32,48,64,128,180,192,256,512}.png` | Raster favicon/app-icon sizes. 180 = apple-touch, 192/512 = PWA manifest. |
| `png/mark-{256,512,1024}.png`, `png/logo-full-1024.png`, `png/logo-horizontal-1200.png` | Raster exports of the auxiliary vectors. |

## Colors

| Role | Hex |
| --- | --- |
| Ink Indigo (outlines, dome, fins) | `#2A2153` |
| Rocket gradient | `#8B5CF6 → #C13B9E` |
| Violet rim / ears | `#7C4DDB` / `#8F7FF0` |
| Flame gradient | `#E1BDFF → #C13B9E` |
| Wordmark light-bg | `#2A2153` + `#B3368C` |
| Wordmark dark-bg | `#F7F9FA` + `#D6A8FF` |

## Rules

- Dark UI: use `-dark` lockups or the mark alone. Light print/docs: default lockups.
- Clear space: half the badge width on all sides. Minimum mark size 24px.
- Wordmark SVGs render with Space Grotesk when available (loaded in the app); PNG exports are safe outside the app.
- Do not recolor, rotate, add glows/shadows, or place the mark on saturated violet fills.
- In React use `components/Logo.tsx` (`size` sm/md/lg, `withWordmark`).

## Regenerating PNGs (macOS)

```bash
qlmanage -t -s <size> -o . logo-rocket.svg && mv logo-rocket.svg.png png/rocket-<size>.png
```
