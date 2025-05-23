"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = campRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function campRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/", authMiddleware_1.authMiddleware, controller.createCamp.bind(controller));
    router.get("/", authMiddleware_1.authMiddleware, controller.getAllCamps.bind(controller));
    router.get("/:id", authMiddleware_1.authMiddleware, controller.getCampById.bind(controller));
    return router;
}
