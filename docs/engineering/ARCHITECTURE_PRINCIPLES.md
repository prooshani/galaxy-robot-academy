# Architecture Principles

## Modular Architecture

Each module has one clearly defined responsibility and a small public interface. Domain boundaries should remain explicit so a change in one area does not create hidden coupling elsewhere.

## Reuse First

Search the repository for existing components, utilities, types, hooks, services, and patterns before writing new code. Extend a suitable implementation when doing so preserves its responsibility and clarity.

## Data-Driven Design

Missions, badges, ranks, Galaxy Energy values, curriculum content, and similar domain concepts must be defined in structured data files. UI and business logic should consume these definitions rather than duplicate them.

## Configuration Over Hardcoding

Values that vary by environment, deployment, course, or policy belong in typed configuration files or environment variables. Defaults and validation should be explicit.

## Separation of Concerns

UI components present state and handle interaction; they must not own business rules or persistence logic. Domain logic, data access, and configuration should live in their appropriate layers.

## Scalability

Design data models and interfaces to support multiple students, teachers, cohorts, courses, and future features. Avoid premature infrastructure, but do not encode single-user assumptions into core contracts.

## No Duplicate Logic

Every concept must have one canonical definition and implementation. Shared calculations, rules, types, and constants belong in shared modules and must not be copied between applications.
