import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware'; 
import { DashboardController } from '../controller/dashboardController';

export default function dashboardRoutes(controller: DashboardController): Router {
  const router = Router();

  // Add authMiddleware if needed
  router.get('/', authMiddleware, controller.getDashboard.bind(controller));

  return router;
}
