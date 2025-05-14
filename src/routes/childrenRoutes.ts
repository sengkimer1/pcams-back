
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ChildController } from "../controller/childrenController";

export default function childRoutes(controller: ChildController): Router {
  const router = Router();

  // Only allow authenticated users (e.g., admin) to create users
  // router.post("/", authMiddleware, controller.createUser.bind(controller));
  router.post("/",authMiddleware, controller.createChild.bind(controller));


  return router;
}
