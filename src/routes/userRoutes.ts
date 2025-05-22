import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controller/UserController";

export default function userRoutes(controller: UserController): Router {
  const router = Router();

  router.post("/",  controller.createUser.bind(controller));
  router.get("/", authMiddleware, controller.getAllUser.bind(controller));
  router.get("/:id", authMiddleware, controller.getUserById.bind(controller));
  router.put("/:id", authMiddleware, controller.updateUser.bind(controller));
  router.delete("/:id", authMiddleware, controller.deleteUser.bind(controller));
  router.get("/role/:roleName", authMiddleware, controller.getOneUserByRole.bind(controller));
  return router;
}