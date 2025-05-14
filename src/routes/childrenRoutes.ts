
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ChildController } from "../controller/childrenController";

export default function childRoutes(controller: ChildController): Router {
  const router = Router();


  router.post("/", controller.createChild.bind(controller));
  router.get("/", controller.getAllChildren.bind(controller));
  router.get("/:id", controller.getChildById.bind(controller));




  return router;
}
