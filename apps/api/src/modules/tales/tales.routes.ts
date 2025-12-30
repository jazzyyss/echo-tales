import { Router } from "express";
import * as TaleController from "./tales.controller.js";
import { upload } from "../../lib/upload.js";

export const taleRouter = Router();

taleRouter.post("/", TaleController.create);
taleRouter.get("/", TaleController.list);
taleRouter.get("/:id", TaleController.getById);
taleRouter.patch("/:id", TaleController.update);
taleRouter.delete("/:id", TaleController.remove);
taleRouter.patch("/:id/toggle-fav", TaleController.toggleFav);
taleRouter.post("/upload", upload.array("images", 10), TaleController.uploadImages);