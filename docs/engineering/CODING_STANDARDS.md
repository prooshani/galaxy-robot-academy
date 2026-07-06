# Coding Standards

## TypeScript

- TypeScript must run in strict mode.
- Public functions, shared data, component props, and module boundaries must use explicit types.
- Avoid `any`; use `unknown` with validation when input cannot be trusted.
- Model valid domain states directly instead of relying on loosely related booleans or strings.

## Naming

- Use descriptive names that communicate intent and domain meaning.
- Use `PascalCase` for React components, classes, and exported type names, such as `MissionCard` and `GalaxyEnergyReward`.
- Use `camelCase` for variables, functions, hooks, and object properties, such as `calculateRank` and `useMissionProgress`.
- Use `kebab-case` for file and folder names, such as `mission-card.tsx` and `game-engine/`.
- Prefix hooks with `use` and name boolean values as clear predicates, such as `isComplete`, `hasBadge`, or `canSubmit`.
- Use `UPPER_SNAKE_CASE` only for true global constants.

## Components and Functions

- Keep components and functions small and single-purpose.
- Keep business logic out of UI components; move it to domain modules, services, or hooks.
- Prefer composition to large components controlled by many unrelated props.
- Make side effects explicit and isolate them from pure calculations.

## Imports and Folders

- Organize imports consistently: framework and external modules, internal modules, then relative modules.
- Use the repository's configured aliases for stable cross-module imports.
- Keep files near their owning feature unless they are genuinely shared.
- Export intentional public APIs rather than relying on deep imports into module internals.

## Implementation Quality

- Prefer explicit, readable control flow over clever shortcuts.
- Remove dead code, unused exports, obsolete flags, debugging output, and commented-out implementations.
- Do not duplicate constants, types, validation, or business rules.
- Handle loading, empty, success, and error states where applicable.
- Validate untrusted input at system boundaries.
- Add comments only when they explain a non-obvious decision or constraint.

## Verification

- Add focused tests for business rules and regressions.
- Run the applicable formatter, lint, typecheck, build, and test commands before review.
- Review the final diff for accidental or unrelated changes.
