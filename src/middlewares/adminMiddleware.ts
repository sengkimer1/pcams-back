import { Request, Response, NextFunction } from "express";

// Assuming req.user is set by authMiddleware with a role property
interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated and has the admin role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  } catch (err) {
    next(err);
  }
};