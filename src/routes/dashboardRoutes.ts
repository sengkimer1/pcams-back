import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { DashboardController } from "../controller/dashboardController";

export default function dashboardRoutes(controller: DashboardController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/coordinator", controller.getAttendanceSummary.bind(controller));
  router.get("/admin", controller.getAdminCampSummary.bind(controller));

  return router;
}