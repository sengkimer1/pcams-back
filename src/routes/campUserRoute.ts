import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CampUserController } from "../controller/campUserController";

export default function campUserRoutes(controller: CampUserController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.create.bind(controller));
  router.get("/", authMiddleware, controller.getAll.bind(controller));
  router.get("/:id", authMiddleware, controller.getById.bind(controller));

  return router;
}