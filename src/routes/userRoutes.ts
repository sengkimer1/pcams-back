import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controller/UserController";
import {adminMiddleware} from "../middlewares/adminMiddleware";

export default function userRoutes(controller: UserController): Router {
  const router = Router();

  router.post("/",[authMiddleware,adminMiddleware],  controller.createUser.bind(controller));
  router.get("/", [authMiddleware,adminMiddleware], controller.getAllUser.bind(controller));
  router.get("/:id", [authMiddleware,adminMiddleware], controller.getUserById.bind(controller));
  router.put("/:id", [authMiddleware,adminMiddleware], controller.updateUser.bind(controller));
  router.delete("/:id", [authMiddleware,adminMiddleware], controller.deleteUser.bind(controller));
  router.get("/role/:roleName", [authMiddleware,adminMiddleware], controller.getOneUserByRole.bind(controller));
  return router;
}