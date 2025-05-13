import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces/userinterfaces";

export class AuthController {
  constructor(private userService: IUserService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
      }

      const result = await this.userService.login(email, password);
      res.status(200).json({ message: "Login successful", data: result });
    } catch (err) {
      console.error("Login error:", err);
      next(err);
    }
  }
}
           