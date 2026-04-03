import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../lib/upload.js";
import * as UserController from "./user.controller.js";

export const userRouter = Router();

userRouter.post(
  "/me/profile-picture",
  requireAuth,
  upload.single("image"),
  UserController.uploadProfilePicture
);

userRouter.delete(
  "/me/profile-picture",
  requireAuth,
  UserController.deleteProfilePicture
);