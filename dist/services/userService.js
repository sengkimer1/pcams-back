"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const loggerService_1 = require("./loggerService");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(data) {
        loggerService_1.logger.info("Creating user", { email: data.email });
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw Object.assign(new Error("User already exists"), { status: 400 });
        }
        const userData = {
            email: data.email,
            password: data.password,
            role: data.role,
            username: data.username,
            nationality: data.nationality,
            created_at: data.created_at || new Date(),
        };
        loggerService_1.logger.info("User data prepared", { userData });
        const newUser = await this.userRepository.create(userData);
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        loggerService_1.logger.info("User created successfully", { id: newUser.id });
        return { user: newUser, token };
    }
    async getAllUsers() {
        loggerService_1.logger.info("Fetching all users");
        return this.userRepository.findAll();
    }
    async getUserById(id) {
        loggerService_1.logger.info("Fetching user by id", { id });
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw Object.assign(new Error("User not found"), { status: 404 });
        }
        return user;
    }
    async login(email, password) {
        loggerService_1.logger.info("Attempting login", { email });
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw Object.assign(new Error("User not found"), { status: 404 });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw Object.assign(new Error("Invalid password"), { status: 400 });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });
        const { password: _, ...userWithoutPassword } = user;
        loggerService_1.logger.info("Login successful", { id: user.id });
        return {
            user: userWithoutPassword,
            token,
        };
    }
    async updateUser(id, updateData) {
        loggerService_1.logger.info("Updating user", { id });
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw Object.assign(new Error("User not found"), { status: 404 });
        }
        const updatedUser = await this.userRepository.update(id, updateData);
        if (!updatedUser) {
            throw Object.assign(new Error("Failed to update user"), { status: 500 });
        }
        loggerService_1.logger.info("User updated successfully", { id });
        return updatedUser;
    }
    async deleteUser(id) {
        loggerService_1.logger.info("Deleting user", { id });
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw Object.assign(new Error("User not found"), { status: 404 });
        }
        const deleted = await this.userRepository.delete(id);
        if (!deleted) {
            throw Object.assign(new Error("Failed to delete user"), { status: 500 });
        }
        loggerService_1.logger.info("User deleted successfully", { id });
    }
    async getOneUserByRole(role) {
        loggerService_1.logger.info("Fetching user by role", { role });
        const user = await this.userRepository.getOneUserByRole(role);
        if (!user) {
            throw Object.assign(new Error("User with specified role not found"), { status: 404 });
        }
        return user;
    }
}
exports.UserService = UserService;
