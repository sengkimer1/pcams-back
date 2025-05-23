"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = loggingMiddleware;
const loggerService_1 = require("../services/loggerService");
const maskSensitiveData_1 = require("../utils/maskSensitiveData");
function loggingMiddleware(req, res, next) {
    const { method, url, headers, body } = req;
    loggerService_1.logger.info("Request received", {
        method,
        url,
        headers,
        body: (0, maskSensitiveData_1.maskSensitiveData)(body),
    });
    next();
}
