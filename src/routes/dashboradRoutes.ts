import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { DashboardController } from '../controller/dashboardController'; // ✅ correct import

export default function dashboardRoutes(controller: DashboardController): Router {
  const router = Router();

  // Apply auth middleware
  router.get('/', authMiddleware, controller.getDashboard.bind(controller));

  return router;
}
