# Review Checklist

Reviewers must ensure every applicable item passes before approving a task. Any failed or unverified item must result in a documented finding or an explicit, justified exception.

- ☐ **Architecture:** The change follows approved boundaries, data flow, shared abstractions, and architecture principles.
- ☐ **Scope:** The requested work is complete and the diff contains no unrelated changes or hidden feature additions.
- ☐ **Naming:** Files, modules, components, functions, types, and variables use clear and consistent domain language.
- ☐ **Types:** TypeScript strictness is preserved, contracts are explicit, and unsafe types or assertions are justified.
- ☐ **Accessibility:** User-facing behavior supports keyboard use, semantic structure, readable contrast, labels, focus states, and assistive technologies.
- ☐ **Performance:** The implementation avoids unnecessary rendering, requests, computation, bundle weight, and unbounded data access.
- ☐ **Security:** Inputs, authorization, secrets, dependencies, data exposure, and trust boundaries have been reviewed.
- ☐ **Tests:** Appropriate tests cover core behavior, edge cases, and regressions, and reported validation results are credible.
- ☐ **Documentation:** Behavior, decisions, configuration, changed files, risks, and usage are documented where required.
- ☐ **Dead Code:** The change contains no unused code, obsolete paths, debugging output, or commented-out implementations.
- ☐ **Dependencies:** New dependencies are necessary, compatible, maintained, secure, and documented; otherwise none were added.
