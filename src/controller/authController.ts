import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces/userinterfaces";
import { logger } from "../services/loggerService";

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
      logger.info("Login successful", { email });
      res.status(200).json({ message: "Login successful", data: result });
    } catch (err) {
      if (err instanceof Error) {
        logger.error("Login error", { error: err.message, email: req.body.email });
      } else {
        logger.error("Login error", { error: "Unknown error", email: req.body.email });
      }
      next(err);
    }
  }
}