import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:4200"),
  JWT_ACCESS_SECRET: z.string().optional(),
  JWT_SECRET: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.format());
  throw new Error("Invalid environment configuration");
}

const rawEnv = parsed.data;

const resolvedJwtSecret = rawEnv.JWT_ACCESS_SECRET ?? rawEnv.JWT_SECRET;

if (rawEnv.NODE_ENV === "production" && !resolvedJwtSecret) {
  throw new Error("JWT_ACCESS_SECRET or JWT_SECRET must be defined in production environment.");
}

export const env = {
  nodeEnv: rawEnv.NODE_ENV,
  isProduction: rawEnv.NODE_ENV === "production",
  port: rawEnv.PORT,
  databaseUrl: rawEnv.DATABASE_URL,
  frontendUrl: rawEnv.FRONTEND_URL,
  jwtSecret: resolvedJwtSecret ?? "dev-fallback-jwt-secret-key-min-32-chars-long"
} as const;
