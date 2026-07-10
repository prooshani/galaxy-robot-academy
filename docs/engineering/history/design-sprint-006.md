# Design Sprint 006 — Final Design QA

## Decisions

- Migrated last legacy route visuals to existing shared system.
- Used visible hydration placeholder instead of blank output.
- Added prefixed backdrop support and opaque fallback.

## Rationale

- Final cohesion required home and role routes to share same tokens, panels, typography, and interaction language.
- Stable loading geometry prevents broken flashes while local state initializes.

## Technical debt

- Firefox and WebKit runtime binaries were unavailable for direct automated execution.

## Future improvements

- Run screenshot suite in CI with all three browser engines when browser binaries become available.

## Lessons learned

- Route-wide viewport automation caught layout risk faster than isolated desktop inspection.
