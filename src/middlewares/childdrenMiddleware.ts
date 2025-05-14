import { z,ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

// Zod Schema for creating a child
export const childSchema = z.object({
    english_name: z.string({ required_error: "English name is required", }).min(1, "English name cannot be empty"),
    khmer_name: z.string({ required_error: "Khmer name is required", }).min(1, "Khmer name cannot be empty"),
    family_id: z.string().uuid("Family ID must be a valid UUID").optional(),
    age: z.number({ invalid_type_error: "Age must be a number", }).int().positive("Age must be a positive integer").optional(),
    gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Gender must be 'Male', 'Female' or 'Other'" }), }).optional(),
    image_url: z.string().url("Image URL must be valid").optional(),
    registered_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Registered date must be in YYYY-MM-DD format").optional(),
    description: z.string().optional(),
    camp_id: z.string({ required_error: "Camp ID is required", }).uuid("Camp ID must be a valid UUID"),
});
export const validateChild = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      childSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      next(error);
    }
  };
  const uuidParamSchema = z.object({
    id: z.string().uuid("ID must be a valid UUID"),
  });
  
  export const validateUUIDParam = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      uuidParamSchema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      next(error);
    }
  };
  
