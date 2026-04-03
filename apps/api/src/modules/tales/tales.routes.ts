import { Router } from "express";
import * as TaleController from "./tales.controller.js";
import { upload } from "../../lib/upload.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const taleRouter = Router();

taleRouter.post(
  "/upload",
  requireAuth,
  upload.array("images", 10),
  TaleController.uploadImages
);

taleRouter.post("/", requireAuth, TaleController.create);
taleRouter.get("/", TaleController.list);
taleRouter.patch("/:id/toggle-fav", requireAuth, TaleController.toggleFav);
taleRouter.delete("/:id/images", requireAuth, TaleController.deleteImage);
taleRouter.get("/:id", requireAuth, TaleController.getById);
taleRouter.patch("/:id", requireAuth, TaleController.update);
taleRouter.delete("/:id", requireAuth, TaleController.remove);