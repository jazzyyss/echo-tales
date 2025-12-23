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

function toPublic(user: any) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });

  const { fullName, email, password } = parsed.data;

  try {
    const { user, accessToken, refreshToken } = await AuthService.signup(fullName, email, password);
    setRefreshCookie(res, refreshToken);
    return res.status(201).json({ user: toPublic(user), accessToken });
  } catch (err: any) {
    if (err?.message === "EMAIL_TAKEN") return res.status(409).json({ message: "Email already in use" });
    return res.status(err?.status ?? 500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });

  const { email, password } = parsed.data;

  try {
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);
    setRefreshCookie(res, refreshToken);
    return res.status(200).json({ user: toPublic(user), accessToken });
  } catch (err: any) {
    if (err?.message === "INVALID_CREDENTIALS") return res.status(401).json({ message: "Invalid credentials" });
    return res.status(err?.status ?? 500).json({ message: "Server error" });
  }
}

export async function logout(req: Request, res: Response) {
  // If you have auth middleware, get userId from req.user. For now accept it from body (not ideal).
  const userId = req.body?.userId as string | undefined;
  if (!userId) return res.status(400).json({ message: "userId required" });

  await AuthService.logout(userId);

  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  return res.status(204).send();
}
