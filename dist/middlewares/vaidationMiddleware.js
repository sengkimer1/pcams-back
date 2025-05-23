"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCampEvent = exports.validateIdInURLParam = exports.validateLogin = exports.validateUser = void 0;
const zod_1 = require("zod");
// Zod Schema for user creation
const userSchema = zod_1.z.object({
    role_id: zod_1.z.number({
        required_error: "Role ID is required",
        invalid_type_error: "Role ID must be a number",
    }).int().positive(),
    khmer_name: zod_1.z.string({
        required_error: "Khmer name is required",
    }).min(1, "Khmer name cannot be empty"),
    english_name: zod_1.z.string({
        required_error: "English name is required",
    }).min(1, "English name cannot be empty"),
    age: zod_1.z.number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number",
    }).int().min(1, "Age must be at least 1"),
    national: zod_1.z.string({
        required_error: "Nationality is required",
    }).min(1, "Nationality cannot be empty"),
    position: zod_1.z.string({
        required_error: "Position is required",
    }).min(1, "Position cannot be empty"),
    email: zod_1.z.string({
        required_error: "Email is required",
    }).email("Invalid email format"),
    password: zod_1.z.string({
        required_error: "Password is required",
    }).min(8, "Password must be at least 8 characters long"),
});
// Zod Schema for login
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
// Zod Schema for ID in URL parameter
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "ID must be a number"),
});
// Zod schema for creating a Camp Event
const campEventSchema = zod_1.z.object({
    camp_event_name: zod_1.z.string({
        required_error: "Camp event name is required"
    }).min(1, "Camp event name cannot be empty")
});
// Middleware: Validate user creation
const validateUser = (req, res, next) => {
    try {
        userSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        next(error);
    }
};
exports.validateUser = validateUser;
// Middleware: Validate login
const validateLogin = (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        next(error);
    }
};
exports.validateLogin = validateLogin;
// Middleware: Validate ID in URL
const validateIdInURLParam = (req, res, next) => {
    try {
        idParamSchema.parse(req.params);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        next(error);
    }
};
exports.validateIdInURLParam = validateIdInURLParam;
const validateCampEvent = (req, res, next) => {
    try {
        campEventSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
            return;
        }
        next(error);
    }
};
exports.validateCampEvent = validateCampEvent;
