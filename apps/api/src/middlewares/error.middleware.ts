import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { env } from "../config/env.js";

/**
 * Centralized Express error-handling middleware.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Zod input validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  // 2. Controlled application errors (AppError, UnauthorizedError, ConflictError, etc.)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  // 3. Unhandled internal errors
  console.error("Unhandled internal server error:", error);

  res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : (error instanceof Error ? error.message : "Internal server error")
  });
}
