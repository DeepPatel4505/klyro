import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, underscores, dashes, and periods"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    username: z.string().trim().optional(),
    email: z.string().trim().email().toLowerCase().optional(),
    identifier: z.string().trim().optional(),
    password: z.string().min(1, "Password is required")
  })
  .refine((data) => data.identifier || data.username || data.email, {
    message: "Either username, email, or identifier is required to login",
    path: ["identifier"]
  });

export type LoginInput = z.infer<typeof loginSchema>;
