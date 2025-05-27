"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = childAttendanceRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function childAttendanceRoutes(controller) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware_1.authMiddleware);
    router.post("/", controller.createChildAttendance.bind(controller));
    router.get("/", controller.getAllChildAttendances.bind(controller));
    router.get("/attendance", controller.getChildAttendanceByDateAndUser.bind(controller)); // New endpoint with query params
    router.get("/:id", controller.getChildAttendanceById.bind(controller));
    router.patch("/:id", controller.updateChildAttendance.bind(controller));
    router.delete("/:id", controller.deleteChildAttendance.bind(controller));
    router.post("/checklist", controller.createChildAttendanceList.bind(controller));
    return router;
}
