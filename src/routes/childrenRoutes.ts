
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ChildController } from "../controller/childrenController";

export default function childRoutes(controller: ChildController): Router {
  const router = Router();


  router.post("/", controller.createChild.bind(controller));
  router.get("/", controller.getAllChildren.bind(controller));
  router.get("/:id", controller.getChildById.bind(controller));
  router.put("/:id", controller.updateChild.bind(controller));
  router.delete("/:id", controller.deleteChild.bind(controller));

  return router;
}
