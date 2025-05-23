"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequestData = sanitizeRequestData;
const sensitiveFields = ["username", "password", "email", "token"];
function sanitizeRequestData(req) {
    const safeData = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    };
    if (req.body && Object.keys(req.body).length > 0) {
        const { username, password, email, ...safeBody } = req.body;
        safeData.body = safeBody;
        sensitiveFields.forEach((field) => {
            if (req.body[field])
                safeData.body[field] = "[MASKED]";
        });
    }
    if (req.cookies && req.cookies.sessionId) {
        safeData.cookies = { sessionId: "[MASKED]" };
    }
    return safeData;
}
