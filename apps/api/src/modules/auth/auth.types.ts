export interface UserRecord {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenRecord {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface CreateRefreshTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface AuthResult {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}
