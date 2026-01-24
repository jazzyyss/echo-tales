import {z} from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  username: z
    .string()
    .min(5)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, underscores")
    .transform((s) => s.trim().toLowerCase()),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});