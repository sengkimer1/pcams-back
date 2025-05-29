import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ChildAttendanceController } from "../controller/childrenAttendanceController";

export default function childAttendanceRoutes(controller: ChildAttendanceController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post("/", controller.createChildAttendance.bind(controller));
  router.get("/child",controller.getByUserId.bind(controller))
  router.get("/", controller.getAllChildAttendances.bind(controller));
  router.get("/attendance", controller.getChildAttendanceByDateAndUser.bind(controller)); // New endpoint with query params
  router.get("/:id", controller.getChildAttendanceById.bind(controller));
  router.patch("/:id", controller.updateChildAttendance.bind(controller));
  router.delete("/:id", controller.deleteChildAttendance.bind(controller));
  router.post("/checklist",controller.createChildAttendanceList.bind(controller))
  return router;
}