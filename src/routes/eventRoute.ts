import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { EventController } from "../controller/eventController";

export default function eventRoutes(controller: EventController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.createEvent.bind(controller));
  router.get("/", authMiddleware, controller.getAllEvents.bind(controller));
  router.get("/:id", authMiddleware, controller.getEventById.bind(controller));
  router.put("/:id", authMiddleware, controller.updateEvent.bind(controller));
  router.delete("/:id", authMiddleware, controller.deleteEvent.bind(controller));

  return router;
}