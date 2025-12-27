import type { Request, Response } from "express";
import * as UserService from "./user.service.js";

export async function authCheck(req: Request, res: Response){

  const user = await UserService.authCheck(req.user!.sub);
  return res.json(user);
}
