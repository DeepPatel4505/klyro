import type { Request, Response, NextFunction } from "express";
import { authService, type AuthService } from "./auth.service.js";
import { REFRESH_TOKEN_COOKIE_NAME } from "../../utils/token.js";
import { env } from "../../config/env.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

/**
 * Sets the refresh token into an HTTP-only secure cookie.
 */
function setRefreshTokenCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "strict" : "lax",
    expires: expiresAt,
    path: "/"
  });
}

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  /**
   * Handles POST /api/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: RegisterInput = req.body;
      const result = await this.service.register(input);

      setRefreshTokenCookie(
        res,
        result.tokens.refreshToken,
        result.tokens.refreshTokenExpiresAt
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          tokenType: result.tokens.tokenType,
          expiresIn: result.tokens.expiresIn
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles POST /api/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: LoginInput = req.body;
      const result = await this.service.login(input);

      setRefreshTokenCookie(
        res,
        result.tokens.refreshToken,
        result.tokens.refreshTokenExpiresAt
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          tokenType: result.tokens.tokenType,
          expiresIn: result.tokens.expiresIn
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
