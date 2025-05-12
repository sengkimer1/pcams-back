import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(
        (req as any).user.role_id, // injected from authMiddleware
        req.body
      );
      res.status(201).json(user);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}
