import { authRepository, type AuthRepository } from "./auth.repository.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken, ACCESS_TOKEN_EXPIRY_SECONDS } from "../../utils/jwt.js";
import { generateRefreshToken } from "../../utils/token.js";
import { ConflictError, UnauthorizedError, BadRequestError } from "../../errors/app-error.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";
import type { AuthResult, AuthenticatedUser, UserRecord } from "./auth.types.js";

function sanitizeUser(user: UserRecord): AuthenticatedUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  /**
   * Registers a new user and generates initial access and refresh tokens.
   */
  async register(input: RegisterInput): Promise<AuthResult> {
    const normalizedEmail = input.email.toLowerCase();

    // 1. Check for duplicates
    const existingUser = await this.repository.findByEmailOrUsername(normalizedEmail, input.username);
    if (existingUser) {
      if (existingUser.email.toLowerCase() === normalizedEmail) {
        throw new ConflictError("An account with this email already exists");
      }
      throw new ConflictError("This username is already taken");
    }

    // 2. Hash password securely
    const hashedPassword = await hashPassword(input.password);

    // 3. Prepare refresh token credentials
    const { rawToken, hashedToken, expiresAt } = generateRefreshToken();

    // 4. Atomically persist user and refresh token in a database transaction
    const { user } = await this.repository.createUserWithRefreshToken(
      {
        username: input.username,
        email: normalizedEmail,
        password: hashedPassword
      },
      {
        token: hashedToken,
        expiresAt
      }
    );

    // 5. Generate short-lived JWT access token
    const accessToken = signAccessToken({
      sub: user.id,
      username: user.username,
      email: user.email
    });

    return {
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
        refreshToken: rawToken,
        refreshTokenExpiresAt: expiresAt
      }
    };
  }

  /**
   * Authenticates user credentials and issues a fresh token pair.
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const identifier = input.identifier ?? input.email ?? input.username;
    if (!identifier) {
      throw new BadRequestError("Username or email is required to login");
    }

    // 1. Find user by email or username
    const user = await this.repository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // 2. Verify password with timing-safe comparison
    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // 3. Generate access token
    const accessToken = signAccessToken({
      sub: user.id,
      username: user.username,
      email: user.email
    });

    // 4. Generate and persist refresh token
    const { rawToken, hashedToken, expiresAt } = generateRefreshToken();
    await this.repository.createRefreshToken({
      token: hashedToken,
      userId: user.id,
      expiresAt
    });

    return {
      user: sanitizeUser(user),
      tokens: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
        refreshToken: rawToken,
        refreshTokenExpiresAt: expiresAt
      }
    };
  }
}

export const authService = new AuthService();
