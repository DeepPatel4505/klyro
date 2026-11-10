import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

/**
 * Express middleware to validate request body using a Zod schema.
 * Replaces req.body with the parsed/coerced data on success.
 */
export function validateBody(schema: ZodType<unknown>) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
