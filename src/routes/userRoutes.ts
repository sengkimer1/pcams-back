// src/routes/userRoutes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controller/UserController";

export default function userRoutes(controller: UserController): Router {
  const router = Router();

  router.post("/", controller.createUser.bind(controller));
  router.get("/",controller.getAllUser.bind(controller));
  router.get("/:id",controller.getUserById.bind(controller));
  router.put("/:id", controller.updateUser.bind(controller));
  router.delete("/:id", controller.deleteUser.bind(controller));

  return router;
}
