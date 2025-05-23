"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const loggerService_1 = require("../services/loggerService");
class AuthController {
    constructor(userService) {
        this.userService = userService;
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required." });
                return;
            }
            const result = await this.userService.login(email, password);
            loggerService_1.logger.info("Login successful", { email });
            res.status(200).json({ message: "Login successful", data: result });
        }
        catch (err) {
            if (err instanceof Error) {
                loggerService_1.logger.error("Login error", { error: err.message, email: req.body.email });
            }
            else {
                loggerService_1.logger.error("Login error", { error: "Unknown error", email: req.body.email });
            }
            next(err);
        }
    }
}
exports.AuthController = AuthController;
