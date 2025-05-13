import { Router } from "express";
import { CampController } from "../controller/campController";
import { authMiddleware } from "../middlewares/authMiddleware";
// import { validateCamp } from "../middlewares/vaidationMiddleware"; // Optional

export default function campRoute(controller: CampController): Router {
  const router = Router();

  router.post("/",  controller.create.bind(controller));
  router.get("/", controller.getAll.bind(controller));
//   router.get("/:id", (req, res) => controller.getById(req, res));
//   router.put("/:id", authMiddleware, controller.update.bind(controller));
//   router.delete("/:id", authMiddleware, controller.delete.bind(controller));

  return router;
}
