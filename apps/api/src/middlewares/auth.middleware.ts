import type {Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";

export function requireAuth(req: Request, res: Response, next: NextFunction){
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing access token" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  
  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = verifyAccessToken(token);
    
    req.user = payload;

    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}