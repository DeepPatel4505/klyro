import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  sub: string;
  username: string;
  email: string;
  [key: string]: unknown;
}

export interface DecodedJwtPayload extends AccessTokenPayload {
  iat: number;
  exp: number;
}

/** Access token lifetime: 15 minutes (in seconds) */
export const ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60;

/**
 * Encodes data to a URL-safe Base64 string.
 */
export function base64UrlEncode(data: string | Buffer): string {
  return Buffer.from(data).toString("base64url");
}

/**
 * Decodes a URL-safe Base64 string to UTF-8.
 */
export function base64UrlDecode(data: string): string {
  return Buffer.from(data, "base64url").toString("utf-8");
}

/**
 * Signs a short-lived (15 minutes) JWT access token.
 */
export function signAccessToken(payload: AccessTokenPayload, options?: SignOptions): string {
  const { sub, ...claims } = payload;

  return jwt.sign(claims, env.jwtSecret, {
    subject: sub,
    expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    algorithm: "HS256",
    ...options
  });
}

/**
 * Verifies a JWT access token. Returns the decoded payload if valid, otherwise null.
 */
export function verifyAccessToken(token: string): DecodedJwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"]
    });

    if (typeof decoded === "string") {
      return null;
    }

    return decoded as DecodedJwtPayload;
  } catch {
    return null;
  }
}

const { TokenExpiredError, JsonWebTokenError } = jwt;
export { TokenExpiredError, JsonWebTokenError };
