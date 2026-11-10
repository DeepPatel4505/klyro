import { prisma } from "../../lib/prisma.js";
import type {
  UserRecord,
  RefreshTokenRecord,
  CreateUserData,
  CreateRefreshTokenData
} from "./auth.types.js";

interface PrismaDelegates {
  user: {
    findFirst(args: { where: Record<string, unknown> }): Promise<UserRecord | null>;
    create(args: { data: CreateUserData }): Promise<UserRecord>;
  };
  refreshToken: {
    create(args: { data: CreateRefreshTokenData }): Promise<RefreshTokenRecord>;
  };
  $transaction<T>(fn: (tx: PrismaDelegates) => Promise<T>): Promise<T>;
}

export class AuthRepository {
  private get db(): PrismaDelegates {
    return prisma as unknown as PrismaDelegates;
  }

  /**
   * Finds a user by exact email or exact username.
   */
  async findByEmailOrUsername(email: string, username: string): Promise<UserRecord | null> {
    return this.db.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username }
        ]
      }
    });
  }

  /**
   * Finds a user by identifier (can match either email or username).
   */
  async findByIdentifier(identifier: string): Promise<UserRecord | null> {
    return this.db.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier }
        ]
      }
    });
  }

  /**
   * Atomically creates a new user and their initial refresh token in a single transaction.
   */
  async createUserWithRefreshToken(
    userData: CreateUserData,
    tokenData: Omit<CreateRefreshTokenData, "userId">
  ): Promise<{ user: UserRecord; refreshToken: RefreshTokenRecord }> {
    return this.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: userData.username,
          email: userData.email.toLowerCase(),
          password: userData.password
        }
      });

      const refreshToken = await tx.refreshToken.create({
        data: {
          token: tokenData.token,
          userId: user.id,
          expiresAt: tokenData.expiresAt
        }
      });

      return { user, refreshToken };
    });
  }

  /**
   * Creates a new refresh token for an existing user.
   */
  async createRefreshToken(tokenData: CreateRefreshTokenData): Promise<RefreshTokenRecord> {
    return this.db.refreshToken.create({
      data: tokenData
    });
  }
}

export const authRepository = new AuthRepository();
