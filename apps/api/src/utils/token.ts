import crypto from "node:crypto";

/** Refresh token lifetime: 7 days (in days and milliseconds) */
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;
export const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export interface GeneratedRefreshToken {
  /** The random secret token sent to the client via secure cookie */
  rawToken: string;
  /** The SHA-256 hash stored in the database */
  hashedToken: string;
  /** When this refresh token will expire */
  expiresAt: Date;
}

/**
 * Generates a cryptographically random refresh token and its SHA-256 digest.
 */
export function generateRefreshToken(): GeneratedRefreshToken {
  const rawToken = crypto.randomBytes(40).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  return {
    rawToken,
    hashedToken,
    expiresAt
  };
}

/**
 * Computes the SHA-256 hash of a raw token for secure database lookup.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
