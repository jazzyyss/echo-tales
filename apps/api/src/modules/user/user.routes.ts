import { Router } from "express";
import * as UserController from "./user.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.get("/check", requireAuth, UserController.authCheck);