import type { Request, Response } from "express";
import * as UserService from "./user.service.js";
import {
  uploadImageBuffer,
  deleteImageByPublicId,
} from "../../lib/cloudinary-upload.js";

function statusFromError(err: unknown) {
  const anyErr = err as any;
  return typeof anyErr?.status === "number" ? anyErr.status : 500;
}

function messageFromError(err: unknown) {
  const anyErr = err as any;
  return typeof anyErr?.message === "string" ? anyErr.message : "Server error";
}

function requireUserId(req: Request) {
  const userId = req.user?.sub;
  if (!userId) {
    const e = new Error("Unauthorized") as Error & { status?: number };
    e.status = 401;
    throw e;
  }
  return userId;
}

export async function uploadProfilePicture(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const existingUser = await UserService.getUserById(userId);
    const oldPublicId = existingUser.media?.profilePicture?.publicId ?? null;

    const uploaded = await uploadImageBuffer(req.file, "users/profile-pictures");

    const updatedUser = await UserService.updateProfilePicture(userId, uploaded);

    if (oldPublicId && oldPublicId !== uploaded.publicId) {
      try {
        await deleteImageByPublicId(oldPublicId);
      } catch {
        // DB remains source of truth
      }
    }

    const profilePicture = updatedUser.media?.profilePicture ?? {
                              publicId: null,
                                secureUrl: null,
                                width: null,
                                height: null,
                                format: null,
                                bytes: null,
                                uploadedAt: null,
                            };

    return res.status(200).json({
      profilePicture,
      user: updatedUser,
    });
  } catch (err) {
    return res
      .status(statusFromError(err))
      .json({ message: messageFromError(err) });
  }
}

export async function deleteProfilePicture(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    const user = await UserService.getUserById(userId);
    const oldPublicId = user.media?.profilePicture?.publicId ?? null;

    await UserService.clearProfilePicture(userId);

    if (oldPublicId) {
      try {
        await deleteImageByPublicId(oldPublicId);
      } catch {
        // DB remains source of truth
      }
    }

    return res.status(204).send();
  } catch (err) {
    return res
      .status(statusFromError(err))
      .json({ message: messageFromError(err) });
  }
}