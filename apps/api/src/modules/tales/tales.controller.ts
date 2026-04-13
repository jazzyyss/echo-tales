import type { Request, Response } from "express";
import * as TaleService from "./tales.services.js";
import {
  createCommentSchema,
  createTaleSchema,
  updateTaleSchema,
} from "./tales.validation.js";
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

export async function uploadImages(req: Request, res: Response) {
  try {
    requireUserId(req);

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploads = await Promise.all(
      req.files.map((file) => uploadImageBuffer(file, "tales"))
    );

    return res.status(201).json({ images: uploads });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    const taleId = req.params.id;
    if (typeof taleId !== "string" || !taleId) {
      return res.status(400).json({ message: "Invalid tale id" });
    }

    const publicId = String(req.body?.publicId ?? "").trim();
    if (!publicId) {
      return res.status(400).json({ message: "publicId required" });
    }

    await TaleService.removeImageFromTale(userId, taleId, publicId);

    try {
      await deleteImageByPublicId(publicId);
    } catch {}

    return res.status(204).send();
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    const parsed = createTaleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
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

export async function listMine(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const tales = await TaleService.listMyTales(userId);
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
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const tale = await TaleService.updateTale(
      userId,
      req.params.id as string,
      parsed.data as any
    );

    return res.status(200).json({ tale });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const deleted = await TaleService.deleteTale(userId, req.params.id as string);

    try {
      await Promise.all(
        (deleted.images ?? []).map((img: any) => deleteImageByPublicId(img.publicId))
      );
    } catch {}

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

export async function toggleLike(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const tale = await TaleService.toggleLike(userId, req.params.id as string);
    return res.status(200).json({ tale });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function listComments(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    const comments = await TaleService.listComments(userId, req.params.id as string);
    return res.status(200).json({ comments });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);

    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const comment = await TaleService.addComment(
      userId,
      req.params.id as string,
      parsed.data.body
    );

    return res.status(201).json({ comment });
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const userId = requireUserId(req);
    await TaleService.deleteComment(
      userId,
      req.params.id as string,
      req.params.commentId as string
    );
    return res.status(204).send();
  } catch (err) {
    return res.status(statusFromError(err)).json({ message: messageFromError(err) });
  }
}