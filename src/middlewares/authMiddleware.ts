// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// interface AuthPayload {
//   id: string;
//   role_id: number;
// }

// export interface AuthRequest extends Request {
//   user?: AuthPayload;
// }

// export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     res.status(401).json({ message: "Unauthorized: No token provided" });
//     return;
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
//     if (!decoded.id || decoded.role_id === undefined) {
//       res.status(401).json({ message: "Invalid token: Missing id or role_id" });
//       return;
//     }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// }


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// This is the data we expect inside the token
interface AuthPayload {
  id: string;
  role_id: number;
}

// We add user info to the request
export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    // Debug: log the token data
    console.log("Decoded token:", decoded);

    // Check if required fields are there
    if (!decoded.id || decoded.role_id === undefined) {
      res.status(401).json({ message: "Invalid token: Missing id or role_id" });
      return;
    }

    // Attach user data to the request
    req.user = decoded;

    // Move to the next handler
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
