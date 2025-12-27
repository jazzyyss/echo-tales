import { UserModel } from "../user/user.model.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { 
  signAccessToken, 
  signRefreshToken,
  verifyRefreshToken, 
  type RefreshTokenPayload
 } from "../../lib/jwt.js";
import { hashRefreshToken } from "../../lib/jwt.js";

function isDupKey(err: unknown) {
  return typeof err === "object" && err !== null && (err as any).code === 11000;
}

function httpError(message: string, status: number) {
  const e = new Error(message) as Error & { status?: number };
  e.status = status;
  return e;
}

async function issueTokens(user: { _id: any; email: string; tokenVersion: number }) {
  const userId = user._id.toString();

  const accessToken = signAccessToken({ sub: userId, email: user.email });

  const refreshToken = signRefreshToken({
    sub: userId,
    tokenVersion: user.tokenVersion,
  });

  // Store hash (NOT the raw token) for rotation / replay protection
  const refreshTokenHash = hashRefreshToken(refreshToken);
  await UserModel.updateOne({ _id: userId }, { $set: { refreshTokenHash } });

  return { accessToken, refreshToken };
}

export async function signup(fullName: string, email: string, password: string) {
  const passwordHash = await hashPassword(password);

  try {
    const user = await UserModel.create({ fullName, email, password: passwordHash });

    const { accessToken, refreshToken } = await issueTokens(user);

    return { user, accessToken, refreshToken };
  } catch (err) {
    if (isDupKey(err)) {
      const e = new Error("EMAIL_TAKEN");
      (e as any).status = 409;
      throw e;
    }
    throw err;
  }
}

export async function login(email: string, password: string) {
  // password is select:false so we must explicitly select it
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    const e = new Error("INVALID_CREDENTIALS");
    (e as any).status = 401;
    throw e;
  }

  const res = await verifyPassword(password, user.password);
  if (!res) {
    const e = new Error("INVALID_CREDENTIALS");
    (e as any).status = 401;
    throw e;
  }

  const { accessToken, refreshToken } = await issueTokens(user);

  return { user, accessToken, refreshToken };
}

export async function refresh(refreshToken: string) {
  let payload: RefreshTokenPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw httpError("INVALID_REFRESH", 401);
  }

  const user = await UserModel.findById(payload.sub).select("+refreshTokenHash");
  if (!user) throw httpError("INVALID_REFRESH", 401);

  if (user.tokenVersion !== payload.tokenVersion) {
    throw httpError("INVALID_REFRESH", 401);
  }

  const incomingHash = hashRefreshToken(refreshToken);
  if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
    throw httpError("INVALID_REFRESH", 401);
  }

  const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user);

  return { user, accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string) {
  // bump tokenVersion to invalidate all existing refresh tokens
  await UserModel.updateOne(
    { _id: userId },
    { $inc: { tokenVersion: 1 }, $set: { refreshTokenHash: null } }
  );
}

