import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout",requireAuth, AuthController.logout);
authRouter.post("/refresh", AuthController.refresh);

