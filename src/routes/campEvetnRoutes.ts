import { Router } from "express";
import { CampEventController } from "../controller/campEventController";
import { validateCampEvent } from "../middlewares/vaidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export default function campEventRoute(controller: CampEventController): Router {
  const router = Router();

  // Create new camp event
  router.post("/",  validateCampEvent, controller.create.bind(controller));

  // Get all camp events
  router.get("/",  controller.getAll.bind(controller));

  // // Get camp event by ID
  // router.get("/:id", authMiddleware, controller.getById.bind(controller));

  // // Update camp event by ID
  // router.put("/:id", authMiddleware, validateCampEvent, controller.update.bind(controller));

  // // Delete camp event by ID
  // router.delete("/:id", authMiddleware, controller.delete.bind(controller));

  return router;
}
