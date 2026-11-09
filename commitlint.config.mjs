export const ALLOWED_SCOPES = [
  "api",     // Backend API service
  "web",     // Frontend Angular application
  "auth",    // Authentication & authorization
  "db",      // Database, schema, and migrations
  "ci",      // Continuous integration & deployment pipelines
  "deps",    // Dependencies & package management
  "config",  // Environment, tool, and workspace configuration
  "docs",    // Documentation files and guides
  "root"     // Monorepo root setup and workspaces
];

export const ALLOWED_TYPES = [
  "feat",     // New feature
  "fix",      // Bug fix
  "docs",     // Documentation only changes
  "style",    // Code style / formatting (no logic change)
  "refactor", // Code refactoring without fixing a bug or adding a feature
  "perf",     // Performance improvement
  "test",     // Adding or updating tests
  "build",    // Build system or external tooling
  "ci",       // CI configuration files and scripts
  "chore",    // Maintenance, housekeeping
  "revert"    // Reverting previous commits
];

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 1. Types: Must be lowercase, non-empty, and from ALLOWED_TYPES
    "type-enum": [2, "always", ALLOWED_TYPES],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // 2. Scopes: STRICTLY MANDATORY (level 2 'never' empty) and must be from ALLOWED_SCOPES
    "scope-empty": [2, "never"],
    "scope-enum": [2, "always", ALLOWED_SCOPES],
    "scope-case": [2, "always", "lower-case"],

    // 3. Subject: Non-empty, no trailing period
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100]
  }
};
