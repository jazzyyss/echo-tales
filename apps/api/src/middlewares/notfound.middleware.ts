import type { Request, Response, NextFunction } from "express";

export function notFoundMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  const err = new Error("Route not found") as Error & { status?: number };
  err.status = 404;
  next(err);
}
