"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dashboardRoutes;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function dashboardRoutes(controller) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware_1.authMiddleware);
    router.get("/coordinator", controller.getAttendanceSummary.bind(controller));
    router.get("/admin", controller.getAdminCampSummary.bind(controller));
    return router;
}
