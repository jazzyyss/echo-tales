import { Router } from "express";
import * as TaleController from "./tales.controller.js";

export const taleRouter = Router();

taleRouter.post("/", TaleController.create);
taleRouter.get("/", TaleController.list);
taleRouter.get("/:id", TaleController.getById);
taleRouter.patch("/:id", TaleController.update);
taleRouter.delete("/:id", TaleController.remove);
taleRouter.patch("/:id/toggle-fav", TaleController.toggleFav);
