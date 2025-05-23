"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    try {
        // Check if user is authenticated and has the admin role
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.adminMiddleware = adminMiddleware;
