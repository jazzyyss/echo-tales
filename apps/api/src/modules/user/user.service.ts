import { Types } from "mongoose";
import { UserModel } from "./user.model.js";

function httpError(message: string, status: number) {
  const e = new Error(message) as Error & { status?: number };
  e.status = status;
  return e;
}

function assertObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw httpError("INVALID_ID", 400);
  }
}

export async function authCheck(id: string){
  const user = await UserModel.findById(id).select("-password");
  return user;
}

export async function getUserById(userId: string) {
  assertObjectId(userId);

  const user = await UserModel.findById(userId);
  if (!user) throw httpError("USER_NOT_FOUND", 404);

  return user;
}

export async function updateProfilePicture(
  userId: string,
  image: {
    publicId: string;
    secureUrl: string;
    width: number | null;
    height: number | null;
    format: string | null;
    bytes: number | null;
    uploadedAt: Date;
  }
) {
  assertObjectId(userId);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        "media.profilePicture": image,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("fullName username email media.profilePicture createdAt updatedAt");

  if (!user) throw httpError("USER_NOT_FOUND", 404);

  return user;
}

export async function clearProfilePicture(userId: string) {
  assertObjectId(userId);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        "media.profilePicture": {
          publicId: null,
          secureUrl: null,
          width: null,
          height: null,
          format: null,
          bytes: null,
          uploadedAt: null,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("fullName username email media.profilePicture createdAt updatedAt");

  if (!user) throw httpError("USER_NOT_FOUND", 404);

  return user;
}