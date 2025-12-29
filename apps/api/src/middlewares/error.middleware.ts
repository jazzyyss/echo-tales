import type {Request, Response, NextFunction} from "express";
import { env } from "../config/env.js";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
){
  const statusCode = err.statusCode ?? 500;

  const message = err.message && statusCode !== 500 ? err.message : "Internal Server Error";

  if(env.NODE_ENV==="development"){
    console.log("Error: ",err);
  }

  res.status(statusCode).json({message});

}