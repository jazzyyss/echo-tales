import type { Request, Response } from "express";
import { signupSchema, loginSchema } from "./auth.validation.js";
import * as AuthService from "./auth.service.js";
import { env } from "../../config/env.js";

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE, // true in production (https)
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
}

function toPublic(user: { _id: unknown; fullName: string; email: string; createdAt: Date; updatedAt: Date }) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  }

  try {
    const { user, accessToken, refreshToken } = await AuthService.signup(
      parsed.data.fullName,
      parsed.data.email,
      parsed.data.password
    );

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({ user: toPublic(user), accessToken });
  } catch (err: any) {
    if (err?.message === "EMAIL_TAKEN") return res.status(409).json({ message: "Email already in use" });
    return res.status(err?.status ?? 500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  }

  try {
    const { user, accessToken, refreshToken } = await AuthService.login(parsed.data.email, parsed.data.password);

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({ user: toPublic(user), accessToken });
  } catch (err: any) {
    if (err?.message === "INVALID_CREDENTIALS") return res.status(401).json({ message: "Invalid credentials" });
    return res.status(err?.status ?? 500).json({ message: "Server error" });
  }
}

/**
 * POST /api/auth/refresh
 * Reads refresh token from httpOnly cookie, rotates it, returns a new access token.
 */
export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  try {
    const { user, accessToken, refreshToken } = await AuthService.refresh(token);

    // rotate refresh cookie
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({ user: toPublic(user), accessToken });
  } catch (err: any) {
    // If refresh fails, clear cookie so client doesn't keep sending garbage
    clearRefreshCookie(res);
    return res.status(err?.status ?? 401).json({ message: "Invalid refresh token" });
  }
}

/**
 * POST /api/auth/logout
 * Must be protected with requireAuth middleware.
 */
export async function logout(req: Request, res: Response) {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  await AuthService.logout(userId);

  clearRefreshCookie(res);
  return res.status(204).send();
}
