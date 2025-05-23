import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ChildAttendanceController } from "../controller/childrenAttendanceController"; // Fixed typo

export default function childAttendanceRoutes(controller: ChildAttendanceController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post("/", controller.createChildAttendance.bind(controller));
  router.get("/", controller.getAllChildAttendances.bind(controller));
  router.get("/:id", controller.getChildAttendanceById.bind(controller));
  router.patch("/:id/:state", controller.updateChildAttendance.bind(controller)); // Updated PATCH route
  router.delete("/:id", controller.deleteChildAttendance.bind(controller));

  return router;
}