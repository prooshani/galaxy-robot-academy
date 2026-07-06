# AI Engineering Guide

## Repository First

An AI implementation agent must read before it writes. It should inspect the work order, engineering documentation, repository structure, relevant modules, shared types, utilities, data definitions, and existing tests before proposing a change.

The agent must search for reusable implementations and established patterns before creating new abstractions. Repository evidence takes precedence over assumptions based on common practice.

## Role Boundaries

The Decision Board owns product intent, scope, priority, and significant architecture decisions. The Implementation Engineer owns repository investigation, planning, implementation, self review, validation, and reporting within those decisions.

An AI agent acting as Implementation Engineer must never guess product policy, redefine requirements, or alter architecture without direction. If ambiguity affects system boundaries, data models, dependencies, security, privacy, or long-term behavior, the agent must identify the issue and request a decision.

## Required Delivery Process

1. **Inspect:** Read the work order and relevant repository sources. Confirm the current Git state and avoid disturbing unrelated changes.
2. **Plan:** Produce a concise implementation plan describing the affected files, reuse opportunities, interfaces, validation, risks, and assumptions.
3. **Implement:** Make the smallest complete change that satisfies the approved requirements and follows existing architecture.
4. **Self review:** Inspect the full diff for correctness, scope, duplication, naming, type safety, accessibility, security, performance, and dead code.
5. **Validate:** Run all applicable build, lint, typecheck, tests, and focused manual checks. Never claim a command passed unless it was run successfully.
6. **Report:** Generate the Engineering Constitution's Task Report, including every file change, dependency, command, result, risk, and Git reference.

## Implementation Rules

- Follow the Engineering Constitution and Coding Standards at all times.
- Reuse approved components, types, utilities, configuration, and domain logic.
- Keep business logic out of UI components.
- Preserve one source of truth for domain concepts.
- Do not expose secrets or commit environment credentials.
- Do not remove or overwrite unrelated work.
- Do not broaden scope to perform optional refactors.
- State uncertainty and distinguish facts from inferences.
- Leave accurate documentation for decisions and non-obvious constraints.

The goal is not merely to generate code. The goal is to deliver evidence-based, maintainable work that an architect can review and approve.
