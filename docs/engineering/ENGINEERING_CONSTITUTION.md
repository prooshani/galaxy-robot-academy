# Galaxy Robot Academy - Hermes Engineering Constitution

**Version:** 1.0  
**Date:** 2026-07-06

## 1. Identity

Hermes is the engineering system for Galaxy Robot Academy. It turns approved product and architecture decisions into reliable, reviewable software while preserving the integrity of the repository.

Every human engineer and AI implementation agent operating within Hermes is a steward of the codebase. Contributors are expected to understand the existing system before changing it and to leave the repository clearer, safer, and easier to extend.

## 2. Mission

The mission of Hermes is to deliver software that supports the educational goals of Galaxy Robot Academy through disciplined implementation, explicit validation, and durable documentation.

Engineering work must serve the approved product direction. Speed is valuable only when scope, quality, maintainability, and repository integrity are preserved.

## 3. Engineering Philosophy

1. **Repository first.** Read the repository, documentation, and existing patterns before proposing or writing code.
2. **Understand before changing.** Trace ownership, data flow, dependencies, and likely side effects before implementation.
3. **Reuse before creating.** Prefer existing components, utilities, types, configuration, and patterns when they satisfy the requirement.
4. **Explicit over clever.** Choose code that is easy to read, test, review, and maintain.
5. **Small, complete changes.** Implement the requested scope fully while avoiding unrelated refactors.
6. **Evidence over assumption.** Validate behavior with appropriate commands and report actual results.
7. **Documentation is part of delivery.** Decisions, risks, dependencies, and file changes must be recorded.

## 4. Roles and Authority

### Decision Board

The Decision Board owns product intent, priorities, scope, and significant architecture decisions. It resolves ambiguity that would change system boundaries, data models, dependencies, security posture, or long-term direction.

### Architect Reviewer

The Architect Reviewer evaluates completed work for architecture alignment, scope discipline, quality, risk, and readiness. The reviewer may approve the work, request changes, or return an unresolved decision to the Decision Board.

### Implementation Engineer

The Implementation Engineer may be a human or AI contributor. This role investigates the repository, prepares an implementation plan, makes approved changes, performs self review and validation, and produces the Task Report.

Implementation Engineers do not redefine product requirements or architecture. When the work order is ambiguous or conflicts with the repository, they must document the issue and request direction rather than guess.

## 5. Core Engineering Principles

- **Single responsibility:** Modules, components, and functions should have one clear purpose.
- **Separation of concerns:** Presentation, business rules, persistence, and configuration must remain appropriately separated.
- **Data-driven behavior:** Missions, badges, ranks, Galaxy Energy values, and similar domain content belong in structured data rather than duplicated implementation logic.
- **Configuration over hardcoding:** Environment-specific and adjustable values must be exposed through typed configuration.
- **One source of truth:** A concept must have one canonical definition. Duplicate types, constants, rules, and calculations are prohibited.
- **Type safety:** Shared contracts must be explicit, and TypeScript must use strict mode.
- **Accessibility, security, and privacy by design:** These qualities are requirements, not optional review enhancements.
- **Scalable foundations:** Designs must support multiple students, cohorts, courses, and future features without premature complexity.
- **Minimal dependencies:** Add a dependency only when it provides clear value that cannot reasonably be achieved with the existing stack.

## 6. Task Lifecycle

Every engineering task follows this lifecycle:

1. The Decision Board approves intent and scope.
2. An Engineering Work Order defines the objective, context, requirements, constraints, acceptance criteria, and exclusions.
3. The Implementation Engineer studies the repository and writes an implementation plan.
4. Coding proceeds within the approved scope and established architecture.
5. The engineer performs a self review against the work order and review checklist.
6. The engineer runs applicable validation, including build, lint, typecheck, tests, and focused manual checks.
7. The engineer creates a complete Task Report with actual results and known risks.
8. The task enters `READY FOR ARCHITECT REVIEW` status.
9. The Architect Reviewer approves the task or requests specific changes.

No task is complete merely because code has been written.

## 7. Validation

Validation must be proportional to the change and must demonstrate that the implementation satisfies its acceptance criteria without breaking existing behavior.

Applicable checks include:

- Build
- Lint
- Typecheck
- Unit, integration, and end-to-end tests
- Accessibility checks
- Security and dependency review
- Manual verification of user-facing flows
- Documentation and link checks

Skipped checks must be identified in the Task Report with a reason. Results must never be invented, inferred, or reported as passing when they were not run.

## 8. Definition of Done

A task is ready for architecture review only when:

- The requested scope is fully implemented.
- Acceptance criteria are satisfied.
- No unrelated changes are included.
- Applicable build, lint, typecheck, and test commands pass.
- Changed behavior and non-obvious decisions are documented.
- Every created, modified, and deleted file is listed in the Task Report.
- New dependencies are justified and documented, or the report states that none were added.
- Known risks, limitations, and follow-up work are documented.
- The work has been self-reviewed.
- The Task Report status is `READY FOR ARCHITECT REVIEW`.

Approval by the Architect Reviewer is the final step of the lifecycle.

## 9. Task Report Format

Every implementation must conclude with this report:

```text
=== TASK REPORT ===
Task: <task name>
Status: READY FOR ARCHITECT REVIEW
Created Files:
* <path or (none)>
Modified Files:
* <path or (none)>
Deleted Files:
* <path or (none)>
Dependencies Added:
<dependencies or None>
Commands Executed:
* <command or (none)>
Validation result:
<checks and outcomes>
Implementation summary:
<concise summary>
Important notes:
<risks, limitations, decisions, or None>
Git:
* Commit hash: <hash or not committed>
* Branch: <branch>
```

The report is an auditable delivery record. It must be accurate, concise, and complete.

## 10. Communication Style

Engineering communication must be direct, factual, and respectful. State assumptions, constraints, evidence, and tradeoffs explicitly. Distinguish confirmed facts from proposals and unresolved questions.

Avoid vague status claims. Report blockers early, identify their impact, and specify the decision or information required to proceed.

## 11. Conflict Resolution

When instructions conflict, use this order of authority:

1. An explicit Decision Board decision or approved Engineering Work Order
2. This Engineering Constitution
3. Approved architecture and product documentation
4. Coding standards and established repository conventions
5. The implementation plan

If applying this order would still require an architecture or product assumption, stop that part of the work and escalate the conflict. Record the issue and its possible consequences.

## 12. Repository Integrity

Contributors must preserve repository history and unrelated work. They must not discard changes they did not create, expose secrets, bypass required checks, commit generated clutter, or make destructive version-control changes without explicit authorization.

Commits must be focused and understandable. Files outside the approved scope must remain unchanged. Any unavoidable collateral change must be explained in the Task Report.

## 13. Long-Term Vision

Galaxy Robot Academy should evolve into a maintainable educational platform that can support many learners, educators, cohorts, courses, missions, and learning experiences. Its engineering system should make future work predictable, reviewable, and safe while allowing the product to grow without repeated reinvention.

Hermes exists to preserve continuity as people, agents, tools, and technologies change.

## 14. Final Principle

**Read first. Decide explicitly. Implement only the approved scope. Validate with evidence. Report truthfully.**
