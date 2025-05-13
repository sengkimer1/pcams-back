import { Router } from "express";
import { validateCampEvent } from "../middlewares/campeventMiddleware";
import { CampEventController } from "../controller/campEventController";

export default function campevent(controller: CampEventController): Router {
  const router = Router();

  router.post("/create", validateCampEvent, controller.create.bind(controller));
  router.get("/", controller.getAll.bind(controller));
//   router.get("/:id", controller.getById.bind(controller));

  
  return router;
}
