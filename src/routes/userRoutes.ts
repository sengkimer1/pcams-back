import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controller/UserController";
import {adminMiddleware} from "../middlewares/adminMiddleware";
import { AuthController } from "../controller/authController"; // adjust path

export default function userRoutes(controller: UserController): Router {
  const router = Router();

  // Place specific routes before dynamic ones like `/:id`
  router.post("/", [authMiddleware, adminMiddleware], controller.createUser.bind(controller));
  router.get("/alluser/campevent", [authMiddleware], controller.getUserbycamp.bind(controller)); // ⬅️ Moved up
  router.get("/", [authMiddleware], controller.getAllUser.bind(controller));
  router.get("/role/:roleName", [authMiddleware, adminMiddleware], controller.getOneUserByRole.bind(controller)); // Also more specific than /:id
  router.get("/:id", [authMiddleware], controller.getUserById.bind(controller));
  router.put("/:id", [authMiddleware], controller.updateUser.bind(controller));
  router.delete("/:id", [authMiddleware, adminMiddleware], controller.deleteUser.bind(controller));

  return router;
}
