import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

const campeventSchema = z.object({
    camp_event_name:z.string({required_error: "camp event name is required",}).min(1, " cannot be empty"),
})
export const validateCampEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      campeventSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      next(error);
    }
  };
  
  
  