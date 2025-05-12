import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Zod Schema for user creation
const userSchema = z.object({
  role_id: z.number({
    required_error: "Role ID is required",
    invalid_type_error: "Role ID must be a number",
  }).int().positive(),

  khmer_name: z.string({
    required_error: "Khmer name is required",
  }).min(1, "Khmer name cannot be empty"),

  english_name: z.string({
    required_error: "English name is required",
  }).min(1, "English name cannot be empty"),

  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }).int().min(1, "Age must be at least 1"),

  national: z.string({
    required_error: "Nationality is required",
  }).min(1, "Nationality cannot be empty"),

  position: z.string({
    required_error: "Position is required",
  }).min(1, "Position cannot be empty"),

  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email format"),

  password: z.string({
    required_error: "Password is required",
  }).min(8, "Password must be at least 8 characters long"),
});

// Zod Schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Zod Schema for ID in URL parameter
const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

// Middleware: Validate user creation
export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    userSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};

// Middleware: Validate login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};

// Middleware: Validate ID in URL
export const validateIdInURLParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    idParamSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};
