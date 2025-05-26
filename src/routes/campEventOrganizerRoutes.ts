import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CampEventOrganizerController } from "../controller/campEventOrganizerController";

export default function campEventOrganizerRoutes(controller: CampEventOrganizerController): Router {
  const router = Router();

  // Middleware to check authentication
  router.use(authMiddleware);

  // Routes
  router.post("/", controller.createCampEventOrganizer.bind(controller));
  router.get("/", controller.getAllCampEventOrganizers.bind(controller));
  router.get("/:id", controller.getCampEventOrganizerById.bind(controller));
  router.put("/:id", controller.updateCampEventOrganizer.bind(controller)); // New update route
  router.delete("/:id", controller.deleteCampEventOrganizer.bind(controller)); // New delete route

  return router;
}