# Agent Instructions: Clean Code and Maintainable Architecture

These instructions define the coding standards the agent must follow when creating, modifying, reviewing, or refactoring code in this repository.

## 1. Core engineering principles

- Prioritize correctness, readability, maintainability, and simplicity.
- Write code that another developer can understand without needing to reverse-engineer it.
- Prefer straightforward solutions over clever or unnecessarily abstract implementations.
- Follow the conventions and architecture already established in the repository unless there is a clear reason to change them.
- Make the smallest reasonable change that fully solves the task.
- Do not introduce unrelated refactors, dependencies, or architectural changes.
- Do not sacrifice correctness or security for fewer lines of code.

## 2. Naming and readability

- Use descriptive, intention-revealing names for variables, functions, classes, types, and files.
- Use nouns for data and domain concepts; use verbs for functions and actions.
- Use clear boolean names such as `isActive`, `hasPermission`, `canSubmit`, and `shouldRetry`.
- Avoid vague names, unexplained abbreviations, and single-letter names except for conventional short scopes such as loop indices.
- Keep formatting, naming, and file conventions consistent with the surrounding code.
- Prefer readable expressions over dense one-liners.
- Avoid deeply nested conditionals; use guard clauses and early returns where they improve clarity.

## 3. Functions and single responsibility

- Give each function one clear, cohesive responsibility.
- Keep functions small enough to understand and test easily, but do not split code into trivial functions without a meaningful benefit.
- Keep side effects explicit.
- Limit function parameters where practical. Use a well-named options object when several related parameters would otherwise make calls unclear.
- Avoid hidden state and surprising behavior.
- Separate orchestration from detailed implementation when doing so improves clarity.

## 4. Modular design and separation of concerns

- Organize code around cohesive features or domain responsibilities, following the repository's existing structure.
- Keep related functionality together.
- Give each module a clear purpose and a well-defined public boundary.
- Expose only what other modules need; avoid importing another module's private implementation details.
- Keep presentation, business logic, data access, validation, and infrastructure concerns separate where appropriate.
- Avoid circular dependencies and unnecessary cross-module coupling.
- Do not create a new module, layer, class, or file unless it provides a meaningful boundary or improves discoverability, testing, or reuse.
- Do not force every feature into the same structure if the domain or repository conventions justify a different approach.

## 5. Reuse and the DRY principle

- Avoid duplicating business rules or substantial logic.
- Extract shared code when there is a real, stable common concept and more than one meaningful use.
- Reuse existing utilities, components, services, types, and patterns before creating new ones.
- Keep abstractions focused and easy to understand.
- Do not create generic frameworks or highly configurable helpers for a single simple use case.
- Do not combine code merely because it looks similar: keep separate implementations when their business meaning or likely evolution differs.
- Avoid premature abstraction. Prefer a little duplication over a misleading or overly complicated abstraction.

## 6. Backend layer and boundary responsibilities

Use these layers when they provide a useful separation for the feature. Do not add layers mechanically.

| Layer | Primary responsibility |
|---|---|
| Route | Declare endpoints and connect them to middleware and controllers |
| Controller / handler | Translate HTTP requests into application calls and construct HTTP responses |
| Service / use case | Coordinate application behavior and enforce business rules |
| Repository / data access | Encapsulate database queries and persistence operations |
| Validation | Validate and parse untrusted input at runtime |
| Middleware | Handle cross-cutting request concerns such as authentication, authorization, logging, and rate limiting |
| Configuration | Load, validate, and expose environment-specific settings |
| Shared utilities | Provide small, generic helpers that are genuinely used across modules |

## 7. Type safety and validation

- Prefer precise types over `any`, unsafe casts, and loosely typed objects.
- Reuse or define domain types and interfaces where they clarify contracts.
- Keep type definitions close to the feature that owns them unless they are genuinely shared.
- Use strict type checking where supported by the project.
- Validate all untrusted external input at runtime, including API payloads, query parameters, environment variables, and external service responses.
- Do not treat compile-time types as runtime validation.
- Avoid non-null assertions and type assertions unless the invariant is clear and justified.
- Handle optional, nullable, and missing values deliberately.

## 8. Error handling and logging

- Never silently swallow errors.
- Handle errors at the layer that has enough context to recover or translate them appropriately.
- Use the project's established error types and centralized error-handling conventions.
- Distinguish validation, authorization, business-rule, not-found, conflict, and infrastructure failures where relevant.
- Preserve useful error context when rethrowing; do not replace every error with an uninformative generic message.
- Return safe, appropriate error messages to users or API clients.
- Never expose secrets, credentials, tokens, stack traces, or sensitive internal details in public responses.
- Log actionable context without logging sensitive data.
- Do not use logging as a substitute for proper error handling.

## 9. Constants and configuration

- Avoid unexplained magic numbers and strings.
- Give meaningful names to values that represent business rules, limits, statuses, or configuration.
- Keep environment-specific configuration in the project's configuration system.
- Validate required configuration at application startup where practical.
- Do not scatter duplicated configuration values across modules.
- Avoid creating constants for values that are obvious, used once, and unlikely to change.

## 10. Testing and testability

- Write tests for important business rules, critical flows, and meaningful edge cases.
- Prefer unit tests for isolated logic and integration tests for boundaries such as databases, APIs, and external services.
- Keep business logic testable without requiring unnecessary infrastructure.
- Use dependency injection or interfaces when they provide useful isolation, not by default everywhere.
- Test observable behavior rather than private implementation details.
- Include failure paths, boundary values, and invalid input in tests where relevant.
- Follow the repository's existing test framework, naming, fixtures, and conventions.
- Do not change or weaken tests merely to make an implementation pass.

## 11. Performance and resource management

- Avoid unnecessary work, repeated calculations, and avoidable allocations in performance-sensitive paths.
- Use pagination for potentially large collections; do not load unbounded datasets by default.
- Avoid N+1 database queries and fetch only the data required by the use case.
- Use transactions when multiple persistence operations must succeed or fail together.
- Add caching only when there is a clear need and a defined invalidation strategy.
- Avoid premature optimization; measure or identify a credible bottleneck first.
- Clean up subscriptions, event listeners, timers, streams, file handles, and other resources according to the framework's lifecycle.
- Consider concurrency, race conditions, idempotency, and retry behavior for asynchronous operations.

## 12. Security by default

- Treat all external input as untrusted.
- Enforce authentication and authorization on the server side; never rely only on UI restrictions.
- Use parameterized queries or the ORM's safe query APIs.
- Do not hardcode secrets or commit credentials, private keys, or tokens.
- Apply least-privilege access.
- Avoid exposing internal identifiers or sensitive data unnecessarily.
- Validate file uploads, URLs, and external resource references according to the application's threat model.
- Use established cryptographic libraries and secure password/token handling; never invent cryptography.
- Consider injection, broken access control, sensitive data exposure, and insecure defaults when changing relevant code.

## 13. Comments and documentation

- Make code self-explanatory through good names and clear structure.
- Write comments to explain why a non-obvious decision exists, not to restate what the code does.
- Document complex business rules, public contracts, important invariants, and non-obvious workarounds.
- Update relevant documentation when behavior, configuration, API contracts, or setup steps change.
- Remove or update stale comments when changing the code they describe.
- Do not add comments to every line or use comments to excuse confusing code.

## 14. Dependencies and design patterns

- Prefer existing project dependencies and platform capabilities when they are sufficient.
- Add a dependency only when its value justifies its maintenance, security, and bundle/runtime cost.
- Use design patterns to solve an actual recurring design problem, not to make code appear sophisticated.
- Prefer composition over inheritance unless inheritance clearly models the relationship.
- Use dependency injection where it improves testability or decoupling.
- Avoid service locators, unnecessary global state, and hidden dependencies.
- Keep interfaces focused; avoid speculative interfaces with only one implementation unless a meaningful boundary requires one.

## 15. Framework and repository consistency

- Before implementing a change, inspect the relevant files and understand the existing flow.
- Follow the project's language, framework, library, linting, formatting, and testing conventions.
- Reuse established patterns when they are sound; do not introduce a competing pattern without a clear reason.
- Check existing helpers, types, components, services, and utilities before creating duplicates.
- Respect existing module boundaries and dependency direction.
- Do not upgrade frameworks, change build tooling, or alter unrelated configuration unless explicitly requested or required.
- Avoid broad refactors when a localized change is sufficient.

## 16. Agent workflow for every coding task

Before changing code:

1. Identify the relevant feature, files, and entry points.
2. Read enough surrounding code to understand the existing architecture and conventions.
3. Trace the current behavior and identify the actual cause or requirement.
4. Check for existing reusable code and tests.
5. Decide on the smallest maintainable implementation.

While changing code:

1. Keep the change focused on the requested task.
2. Preserve existing behavior unless the task explicitly changes it.
3. Keep boundaries, types, and error handling consistent.
4. Avoid unrelated cleanup and speculative enhancements.
5. Add or update tests for the changed behavior.

After changing code:

1. Review the diff for accidental changes, duplication, dead code, and unnecessary abstractions.
2. Run relevant formatting, linting, type-checking, and tests when available.
3. Fix issues introduced by the change.
4. Clearly report what changed and which checks were run.
5. State any checks that could not be run and why; never claim a check passed if it was not executed.

## 17. Definition of done

A change is ready when:

- It solves the requested problem and preserves intended existing behavior.
- The code is readable and follows repository conventions.
- Responsibilities and module boundaries remain clear.
- Reuse is applied where it is genuinely beneficial, without premature abstraction.
- Inputs, errors, and important edge cases are handled.
- Relevant tests are added or updated and pass, or limitations are clearly reported.
- No unrelated files or behavior were changed unnecessarily.
- The final summary accurately describes the implementation and verification.

## 18. Final decision rule

When choosing between implementations, prefer the option that:

1. Correctly satisfies the requirements.
2. Is easiest for another developer to understand.
3. Fits the existing architecture and conventions.
4. Has the fewest unnecessary dependencies and abstractions.
5. Is straightforward to test, debug, and extend.

**Do not optimize for minimum lines of code or maximum abstraction. Optimize for clear, reliable, maintainable software.**
