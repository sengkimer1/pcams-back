"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userinterfaces_1 = require("../interfaces/userinterfaces");
const loggerService_1 = require("../services/loggerService");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(req, res, next) {
        try {
            const { email, password, role, username, nationality, created_at } = req.body;
            if (!email || !password || !role) {
                throw Object.assign(new Error("Email, password, and role are required"), { status: 400 });
            }
            if (!Object.values(userinterfaces_1.UserRole).includes(role)) {
                throw Object.assign(new Error("Invalid role"), { status: 400 });
            }
            const result = await this.userService.createUser({
                email,
                password,
                role,
                username,
                nationality,
                created_at: created_at ? new Date(created_at) : new Date(),
            });
            loggerService_1.logger.info("User created", { email });
            res.status(201).json({ message: "A new user was created.", data: result });
        }
        catch (err) {
            loggerService_1.logger.error("Error in createUser", { error: err instanceof Error ? err.message : "Unknown error" });
            next(err);
        }
    }
    async getAllUser(req, res, next) {
        try {
            const users = await this.userService.getAllUsers();
            loggerService_1.logger.info("Fetched all users");
            res.status(200).json(users);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getAllUser", { error: err instanceof Error ? err.message : "Unknown error" });
            next(err);
        }
    }
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            loggerService_1.logger.info("Fetched user by id", { id });
            res.status(200).json(user);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getUserById", { error: err instanceof Error ? err.message : "Unknown error", id: req.params.id });
            next(err);
        }
    }
    async updateUser(req, res, next) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            if (updateData.role && !Object.values(userinterfaces_1.UserRole).includes(updateData.role)) {
                throw Object.assign(new Error("Invalid role"), { status: 400 });
            }
            const updatedUser = await this.userService.updateUser(id, updateData);
            loggerService_1.logger.info("User updated", { id });
            res.status(200).json({ message: "User updated", data: updatedUser });
        }
        catch (err) {
            loggerService_1.logger.error("Error in updateUser", { error: err instanceof Error ? err.message : "Unknown error", id: req.params.id });
            next(err);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            await this.userService.deleteUser(id);
            loggerService_1.logger.info("User deleted", { id });
            res.status(200).json({ message: "User deleted successfully." });
        }
        catch (err) {
            loggerService_1.logger.error("Error in deleteUser", { error: err instanceof Error ? err.message : "Unknown error", id: req.params.id });
            next(err);
        }
    }
    async getOneUserByRole(req, res, next) {
        try {
            const roleName = req.params.roleName;
            if (!Object.values(userinterfaces_1.UserRole).includes(roleName)) {
                throw Object.assign(new Error("Invalid role"), { status: 400 });
            }
            const user = await this.userService.getOneUserByRole(roleName);
            loggerService_1.logger.info("Fetched user by role", { role: roleName });
            res.status(200).json(user);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getOneUserByRole", { error: err instanceof Error ? err.message : "Unknown error", role: req.params.roleName });
            next(err);
        }
    }
}
exports.UserController = UserController;
