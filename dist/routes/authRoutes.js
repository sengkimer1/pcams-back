"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const express_1 = require("express");
const vaidationMiddleware_1 = require("../middlewares/vaidationMiddleware");
function authRoutes(controller) {
    const router = (0, express_1.Router)();
    router.post("/login", vaidationMiddleware_1.validateLogin, controller.login.bind(controller));
    return router;
}
