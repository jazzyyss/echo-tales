import type { Request, Response } from "express";
import * as TaleService from "./tales.services.js";
import { createTaleSchema, updateTaleSchema } from "./tales.validation.js";

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

export async function create(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    const parsed = createTaleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const tale = await TaleService.createTale(userId, parsed.data);
    return res.status(201).json({ tale });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const tales = await TaleService.listTales(userId);
    return res.status(200).json({ tales });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const tale = await TaleService.getTaleById(userId, req.params.id as string);
    return res.status(200).json({ tale });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    const parsed = updateTaleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const tale = await TaleService.updateTale(userId, req.params.id as string, parsed.data as any);
    return res.status(200).json({ tale });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    await TaleService.deleteTale(userId, req.params.id as string);
    return res.status(204).send();
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function toggleFav(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const tale = await TaleService.toggleFav(userId, req.params.id as string);
    return res.status(200).json({ tale });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}
