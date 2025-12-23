import { UserModel } from "../user/user.model.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { signAccessToken, signRefreshToken } from "../../lib/jwt.js";

function isDupKey(err: unknown) {
  return typeof err === "object" && err !== null && (err as any).code === 11000;
}

export async function signup(fullName: string, email: string, password: string) {
  const passwordHash = await hashPassword(password);

  try {
    const user = await UserModel.create({ fullName, email, password: passwordHash });

    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), tokenVersion: user.tokenVersion });

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
  const user = await UserModel.findOne({ email }).select("+password +tokenVersion");
  if (!user) {
    const e = new Error("INVALID_CREDENTIALS");
    (e as any).status = 401;
    throw e;
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    const e = new Error("INVALID_CREDENTIALS");
    (e as any).status = 401;
    throw e;
  }

  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
  const refreshToken = signRefreshToken({ sub: user._id.toString(), tokenVersion: user.tokenVersion });

  return { user, accessToken, refreshToken };
}

export async function logout(userId: string) {
  // bump tokenVersion to invalidate all existing refresh tokens
  await UserModel.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
}