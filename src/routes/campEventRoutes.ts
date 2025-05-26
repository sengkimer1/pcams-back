import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CampEventController } from "../controller/campEventController";

export default function campEventRoutes(controller: CampEventController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.createCampEvent.bind(controller));
  router.get("/", authMiddleware, controller.getAllCampEvents.bind(controller));
  router.get("/:id", authMiddleware, controller.getCampEventById.bind(controller));
  router.put("/:id", authMiddleware, controller.updateCampEvent.bind(controller));
  router.delete("/:id", authMiddleware, controller.deleteCampEvent.bind(controller));

  return router;
}