import { Router } from "express";
import { CampController } from "../controller/campController";
import { authMiddleware } from "../middlewares/authMiddleware";

export default function campRoute(controller: CampController): Router {
  const router = Router();

  router.post("/",authMiddleware, controller.create.bind(controller));
  router.get("/",authMiddleware, controller.getAll.bind(controller));
  router.get("/:id",authMiddleware, controller.getById.bind(controller));
  router.put("/:id",authMiddleware, authMiddleware, controller.update.bind(controller));
  router.delete("/:id", authMiddleware, controller.delete.bind(controller));

  return router;
}