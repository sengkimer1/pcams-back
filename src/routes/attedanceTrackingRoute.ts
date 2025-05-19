import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AttendanceTrackingController } from "../controller/attendanceTrackingController";

export default function attendanceRoutes(controller: AttendanceTrackingController): Router {
  const router = Router();

  router.patch("/:id/status", authMiddleware, controller.updateStatus.bind(controller));
  router.post("/", authMiddleware, controller.create.bind(controller));

  return router;
}