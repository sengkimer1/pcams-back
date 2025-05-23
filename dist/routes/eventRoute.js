"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = eventRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function eventRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/", authMiddleware_1.authMiddleware, controller.createEvent.bind(controller));
    router.get("/", authMiddleware_1.authMiddleware, controller.getAllEvents.bind(controller));
    return router;
}
