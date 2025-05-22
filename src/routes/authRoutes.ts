import { Router } from "express";
import { validateLogin } from "../middlewares/vaidationMiddleware";
import { AuthController } from "../controller/authController";

export default function authRoutes(controller: AuthController): Router {
  const router = Router();

  router.post("/login", validateLogin, controller.login.bind(controller));

  return router;
}