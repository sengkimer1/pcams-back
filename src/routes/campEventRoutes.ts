import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CampEventController } from "../controller/campEventController";

export default function campEventRoutes(controller: CampEventController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.createCampEvent.bind(controller));
  router.get("/", authMiddleware, controller.getAllCampEvents.bind(controller));

  return router;
}