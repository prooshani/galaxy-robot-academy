# Engineering Workflow

```text
Decision Board -> Engineering Work Order -> Implementation Plan -> Coding -> Self Review -> Validation -> Task Report -> READY FOR ARCHITECT REVIEW -> Architecture Review -> Approved
```

## Decision Board

The Decision Board establishes product intent, priority, scope, and significant architecture decisions. Unresolved questions that affect these areas return to the board.

## Engineering Work Order

The work order translates an approved decision into an actionable task. It defines context, requirements, constraints, acceptance criteria, expected deliverables, and out-of-scope work.

## Implementation Plan

The Implementation Engineer studies the repository and describes the files, interfaces, tests, and sequence of changes. The plan must align with existing architecture and identify uncertainty before coding begins.

## Coding

The engineer implements only the approved scope using established patterns and shared abstractions. Changes should be focused, readable, typed, accessible, and secure.

## Self Review

The engineer reviews the complete diff against the work order, Coding Standards, and Review Checklist. Scope drift, dead code, duplication, and accidental changes must be removed.

## Validation

The engineer runs every applicable build, lint, typecheck, test, accessibility, security, and manual verification step. Failures are fixed or reported accurately as blockers.

## Task Report

The engineer records all file changes, dependencies, commands, validation results, implementation details, risks, and Git information using the constitution's report format.

## READY FOR ARCHITECT REVIEW

This status means implementation, self review, validation, and reporting are complete. It does not mean the task has been approved.

## Architecture Review

The Architect Reviewer checks architecture alignment, scope, quality, risks, and evidence. The reviewer may approve the task or return actionable findings.

## Approved

Approval confirms that the task meets its work order and engineering standards. Any subsequent change requires a new task or explicitly approved follow-up.
