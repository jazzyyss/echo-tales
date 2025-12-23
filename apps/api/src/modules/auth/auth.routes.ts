import { Router } from "express";
import * as AuthController from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
