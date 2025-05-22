import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { EventController } from "../controller/eventController";

export default function eventRoutes(controller: EventController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.createEvent.bind(controller));
  router.get("/", authMiddleware, controller.getAllEvents.bind(controller));

  return router;
}