# Brand Guide

## Core

- **Name:** Galaxy Robot Academy
- **Promise:** **Build. Think. Explore.**
- **Positioning:** software engineering academy presented as a credible deep-space expedition.
- **Audience:** curious learners aged 9–12; teachers and parents who expect rigor, safety, and clarity.
- **Maturity:** never babyish. Use wonder, agency, and technical authenticity without adult corporate coldness.

## Personality

Curious, capable, brave, precise, optimistic, collaborative. Emotional rhythm moves from mystery to investigation to earned celebration. Learning is engineering practice: mistakes become signals, tests become scans, progress becomes visible capability.

Visual position: layered deep-space environments, mission-control structure, readable technical typography, restrained cyan/purple energy, and warm reward accents. It must never resemble preschool media, generic SaaS, school administration, cheap gaming, casino rewards, military propaganda, or dense fictional HUD screens.

## Logo

The mark is the R0-B0 badge: a robot head (indigo dome, violet rim, antenna, side sensors) holding a starfield with a launching rocket — the whole product story in one shape. Master SVGs and exported PNG sizes live in `apps/web/public/brand/` (see its README for files, colors, clear-space, and misuse rules).

- **Rocket icon** (`logo-rocket.svg`, `apps/web/app/icon.svg`): favicon/app-icon voice — gradient rocket, no text, no background.
- **Badge mark** (`logo-mark.svg`): nav, avatars, watermarks; use `components/Logo.tsx` in product code.
- **Lockups** (`logo-full*`, `logo-horizontal*`): stacked and horizontal wordmark versions; `-dark` variants for dark surfaces.
- Logo colors are fixed artwork (ink indigo `#2A2153`, violet→magenta gradient) and are not restyled by UI theme tokens.

## Audience modes

Student surfaces use adventurous verbs, generous cards, visible progress, and R0-B0 reactions. Teacher surfaces use compact hierarchy, explicit state, reliable tables, and direct operational language. Both share tokens and components; density and tone change, quality does not.

## R0-B0

R0-B0 is mascot, narrative companion, and progress mirror—not lecturer, answer machine, or decorative sticker. It learns beside students, responds to real milestones, offers clues, and visibly gains capabilities. See [R0-B0 Personality](ROBOT_PERSONALITY.md).

## Brand tests

Every screen should answer yes:

- Can a 10-year-old understand next action?
- Would a teacher trust this interface?
- Does space metaphor support task instead of obscuring it?
- Is celebration earned and readable?
