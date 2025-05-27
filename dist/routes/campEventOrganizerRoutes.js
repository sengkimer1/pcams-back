"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = campEventOrganizerRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function campEventOrganizerRoutes(controller) {
    const router = (0, express_1.Router)();
    // Middleware to check authentication
    router.use(authMiddleware_1.authMiddleware);
    // Routes
    router.post("/", controller.createCampEventOrganizer.bind(controller));
    router.get("/", controller.getAllCampEventOrganizers.bind(controller));
    router.get("/:id", controller.getCampEventOrganizerById.bind(controller));
    router.put("/:id", controller.updateCampEventOrganizer.bind(controller)); // New update route
    router.delete("/:id", controller.deleteCampEventOrganizer.bind(controller)); // New delete route
    return router;
}
