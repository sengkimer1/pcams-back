"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
function userRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/", [authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware], controller.createUser.bind(controller));
    router.get("/", [authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware], controller.getAllUser.bind(controller));
    router.get("/:id", [authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware], controller.getUserById.bind(controller));
    router.put("/:id", [authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware], controller.updateUser.bind(controller));
    router.delete("/:id", [authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware], controller.deleteUser.bind(controller));
    router.get("/role/:roleName", [authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware], controller.getOneUserByRole.bind(controller));
    return router;
}
