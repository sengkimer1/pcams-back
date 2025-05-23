"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = campEventRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function campEventRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/", authMiddleware_1.authMiddleware, controller.createCampEvent.bind(controller));
    router.get("/", authMiddleware_1.authMiddleware, controller.getAllCampEvents.bind(controller));
    return router;
}
