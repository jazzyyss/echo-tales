import dotenv from "dotenv";
import { z } from "zod";
import type { StringValue } from "ms";

dotenv.config({ quiet: true });


const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  ACCESS_TOKEN_TTL: z.custom<StringValue>().default("15m"),
  REFRESH_TOKEN_TTL: z.custom<StringValue>().default("30d"),

  COOKIE_SECURE: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);
