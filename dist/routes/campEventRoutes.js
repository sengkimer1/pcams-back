"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = campEventRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function campEventRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/", authMiddleware_1.authMiddleware, controller.createCampEvent.bind(controller));
    router.get("/", authMiddleware_1.authMiddleware, controller.getAllCampEvents.bind(controller));
    router.get("/:id", authMiddleware_1.authMiddleware, controller.getCampEventById.bind(controller));
    router.put("/:id", authMiddleware_1.authMiddleware, controller.updateCampEvent.bind(controller));
    router.delete("/:id", authMiddleware_1.authMiddleware, controller.deleteCampEvent.bind(controller));
    return router;
}
