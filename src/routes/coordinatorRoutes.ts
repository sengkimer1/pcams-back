import express, { Router } from 'express';
import { CoordinatorController } from '../controller/coordinatorController';
import { authMiddleware } from '../middlewares/authMiddleware';

export default function coordinatorRoutes(controller : CoordinatorController): Router{
    const router = Router();
    router.get('/', authMiddleware,controller.getCoordinatorSummary.bind(controller));
    return router;
}


