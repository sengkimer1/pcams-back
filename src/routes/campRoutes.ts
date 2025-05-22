import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CampController } from "../controller/campController";

export default function campRoutes(controller: CampController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.createCamp.bind(controller));
  router.get("/", authMiddleware, controller.getAllCamps.bind(controller));
  router.get("/:id", authMiddleware, controller.getCampById.bind(controller));

  return router;
}