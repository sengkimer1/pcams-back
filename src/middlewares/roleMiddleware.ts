import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { Pool } from "pg";

// Accept pool as a parameter to avoid relying on global pool
export function authorizeRoles(pool: Pool, allowedRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Forbidden: No user info found" });
    }

    try {
      const result = await pool.query(
        `SELECT r.name 
         FROM users u 
         JOIN role r ON u.role_id = r.id 
         WHERE u.id = $1`,
        [req.user.id]
      );

      const userRole = result.rows[0]?.name;

      if (!userRole) {
        return res.status(403).json({ message: "Forbidden: Role not found" });
      }

      const normalizedRole = userRole.toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

      if (!normalizedAllowedRoles.includes(normalizedRole)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
