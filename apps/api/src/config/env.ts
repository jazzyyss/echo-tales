import dotenv from "dotenv";

dotenv.config({ quiet: true });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 4000,
  JWT_SECRET: required("JWT_SECRET"),
  DATABASE_URI: required("DATABASE_URI"),
};
