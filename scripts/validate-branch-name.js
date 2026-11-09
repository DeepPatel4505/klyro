#!/usr/bin/env node

import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Allowed production, deployment, and detached CI branches
export const EXEMPT_BRANCHES = [
  "main",
  "master",
  "develop",
  "staging",
  "HEAD"
];

// Strictly allowed fixed set of scopes
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

// Strictly allowed conventional types
export const ALLOWED_TYPES = [
  "feat",
  "fix",
  "chore",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "revert"
];

const typesPattern = ALLOWED_TYPES.join("|");
const scopesPattern = ALLOWED_SCOPES.join("|");

// Strictly requires format: <type>(<scope>)/<description>
// Examples: feat(api)/auth-tokens, fix(web)/navbar-overflow, chore(deps)/update-prisma
export const BRANCH_REGEX = new RegExp(
  `^(release|hotfix)\\/v?[0-9_.-]+$|^(${typesPattern})\\((${scopesPattern})\\)\\/[a-z0-9_.-]+$`
);

export function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}

export function validateBranch(branchName = getCurrentBranch()) {
  if (!branchName) {
    console.warn("⚠️  Could not determine current Git branch. Skipping branch validation.");
    return true;
  }

  // Allow exempt branches (main, develop, etc.)
  if (EXEMPT_BRANCHES.includes(branchName)) {
    return true;
  }

  if (!BRANCH_REGEX.test(branchName)) {
    console.error("\n❌  Invalid Git branch name: \"" + branchName + "\"");
    console.error("\nBranch names MUST strictly include an allowed scope in parentheses:");
    console.error("\n  Format:   <type>(<scope>)/<description>");
    console.error("  Types:    " + ALLOWED_TYPES.join(", "));
    console.error("  Scopes:   " + ALLOWED_SCOPES.join(", ") + "  [MANDATORY]");
    console.error("\nValid Examples:");
    console.error("  ✔ feat(api)/auth-tokens");
    console.error("  ✔ fix(web)/login-form-validation");
    console.error("  ✔ chore(deps)/update-prisma");
    console.error("  ✔ docs(root)/update-readme");
    console.error("  ✔ feat(auth)/jwt-rotation");
    console.error("\nInvalid Examples (will be blocked):");
    console.error("  ✖ feat/auth-tokens              (missing scope)");
    console.error("  ✖ feat(custom)/my-feature       (unknown scope)");
    console.error("  ✖ feature(api)/login            (invalid type)");
    console.error("\nTo rename your current branch to a valid name, run:");
    console.error("  git branch -m <type>(<scope>)/<description>\n");
    return false;
  }

  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isValid = validateBranch();
  if (!isValid) {
    process.exit(1);
  }
}
