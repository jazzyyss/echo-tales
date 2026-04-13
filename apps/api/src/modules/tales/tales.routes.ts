import { Router } from "express";
import * as TaleController from "./tales.controller.js";
import { upload } from "../../lib/upload.js";

export const taleRouter = Router();

taleRouter.post("/upload", upload.array("images", 10), TaleController.uploadImages);

taleRouter.get("/", TaleController.list);
taleRouter.get("/me", TaleController.listMine);

taleRouter.post("/", TaleController.create);

taleRouter.patch("/:id/toggle-fav", TaleController.toggleFav);
taleRouter.patch("/:id/toggle-like", TaleController.toggleLike);

taleRouter.get("/:id/comments", TaleController.listComments);
taleRouter.post("/:id/comments", TaleController.addComment);
taleRouter.delete("/:id/comments/:commentId", TaleController.deleteComment);

taleRouter.delete("/:id/images", TaleController.deleteImage);
taleRouter.get("/:id", TaleController.getById);
taleRouter.patch("/:id", TaleController.update);
taleRouter.delete("/:id", TaleController.remove);