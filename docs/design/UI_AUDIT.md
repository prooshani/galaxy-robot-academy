# UI Audit

Audit date: 2026-07-10. Scope: checked-in repository, not historical screenshots.

## Confirmed facts

| Area | Evidence | Finding |
| --- | --- | --- |
| Framework | `apps/web/package.json` | Next `^16.0.0`, React `^19.0.0`, TypeScript `^5.7.0`. |
| Tailwind | `apps/web/package.json` | Tailwind and `@tailwindcss/postcss` `^4.0.0` installed as dev dependencies. |
| CSS entry | `apps/web/app/globals.css:1` | Contains only `@import "tailwindcss";`. No variables, reset extensions, theme, or explicit `@source`. |
| CSS loading | `apps/web/app/layout.tsx:2` | Root layout imports `./globals.css`. |
| PostCSS | repository file inventory | **No `postcss.config.*` exists.** Installed plugin is therefore not configured. Blocking defect. |
| Production output | `pnpm build` on 2026-07-10 | Build succeeds, but emits no `apps/web/.next/static/css` directory or CSS asset. This confirms production has no generated Tailwind utilities. |
| Tailwind config | repository file inventory | No `tailwind.config.*`; valid for v4 CSS-first setup, but no CSS theme/source configuration replaces it. |
| Utilities | route files and `packages/ui/src/Layout.tsx` | Current components contain extensive Tailwind utilities, responsive prefixes, states, arbitrary colors, and dynamic class composition. Markup is not browser-default by intent. |
| Shared UI | `packages/ui/src/index.ts`, `Layout.tsx` | Package exports only `Layout`; it contains Tailwind classes. No tokens or component library yet. |
| Package compilation | `apps/web/next.config.ts` | Empty config; no `transpilePackages`. Workspace source currently resolves during builds, but this should be verified when package complexity grows. |
| Source scanning | `globals.css`, package boundary | No explicit `@source "../../../packages/ui/src"`. Tailwind v4 automatic detection may ignore workspace/package paths, especially ignored package sources. Shared-package generation is unproven. |
| Fonts | `apps/web/app/layout.tsx` | No `next/font`, local font, stylesheet link, or font token. Browser defaults apply. `antialiased` exists but depends on Tailwind output. |
| Variables | `globals.css` | No CSS custom properties. Colors repeat as utilities/arbitrary hex. |
| Icons/motion | `apps/web/package.json`, route sources | Lucide and Framer Motion named in PRD but not installed. UI uses emoji; no motion library. |
| Responsiveness | route sources | Basic `sm:`/`lg:` grids and flex changes exist. Navigation wraps. Dense tables only use horizontal scrolling. No tested mobile shell or safe-area rules. |
| Accessibility | route sources | Many labels, `aria-label`s, focus utilities, semantic tables exist. Focus styling fails visually when CSS pipeline fails. Status and errors often rely heavily on color; emoji labels are inconsistent; native prompt/confirm drives teacher review. |

## Why screenshots appear unstyled

Primary confirmed cause: missing PostCSS configuration. Tailwind v4 requires `@tailwindcss/postcss` registered in PostCSS for `@import "tailwindcss"` and utility generation. Dependency installation alone does nothing. Next loads `globals.css`, but without transform there is no generated CSS for class names. A clean production build succeeds yet emits no CSS directory, proving this is a silent styling failure rather than a compile failure.

Possible secondary cause after processor repair: monorepo source discovery. `packages/ui/src/Layout.tsx` lives outside `apps/web`; no explicit v4 `@source` registers it. Test generated CSS for package-only classes. This is an evidence-backed risk, not confirmed failure.

Historical mismatch: current source is heavily styled and latest local commit is ahead of `origin/main`. Screenshots may represent older code or deployment. Confirm deployment SHA before attributing every screenshot to current source.

## Blocking issues

1. Missing PostCSS config prevents reliable Tailwind compilation.
2. No token/theme layer: even after compilation, repeated colors and utilities create drift.
3. Shared-package source inclusion lacks explicit contract and build proof.

## Non-blocking issues

- No explicit font loading; default typography undermines brand.
- Only one shared UI component; route-local duplication is high.
- Hard-coded `#0a0e1a`, `#111827`, and state palettes lack semantic meaning.
- Dynamic class fragments work only because complete strings are present; future string interpolation could evade extraction.
- Teacher actions use blocking browser dialogs; weak error recovery and screen-reader experience.
- Mission status prints internal camelCase values.
- Loading/empty/error states are incomplete; `RoleGuard` renders blank during hydration.
- Emoji mix visual styles across platforms.
- No verified reduced-motion behavior, touch-target contract, or contrast audit.

## Recommended implementation order

1. Repair and verify Tailwind/PostCSS in dev and production; record generated-CSS proof.
2. Add explicit monorepo sources and verify a class used only in `packages/ui`.
3. Establish CSS variables, fonts, base styles, focus ring, and reduced-motion defaults.
4. Build primitives in `packages/ui`; migrate repeated route patterns.
5. Build Academy compositions in `apps/web/components`.
6. Implement shell/navigation, then student routes, mission flow, teacher routes, and reward moments.
7. Run responsive, keyboard, screen-reader, contrast, production-build, and visual-regression checks.

## Assumptions requiring runtime proof

- Existing `.next` artifacts were not treated as authoritative build output.
- Automatic Tailwind scanning behavior across pnpm workspace packages requires a clean build after configuration.
- Current deployment revision and screenshot revision are unknown.
