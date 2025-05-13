// src/routes/userRoutes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controller/UserController";

export default function userRoutes(controller: UserController): Router {
  const router = Router();

  // Only allow authenticated users (e.g., admin) to create users
  // router.post("/", authMiddleware, controller.createUser.bind(controller));
  router.post("/",authMiddleware, controller.createUser.bind(controller));


  return router;
}
