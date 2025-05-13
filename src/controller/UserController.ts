import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password,
        role_id,
        khmer_name,
        english_name,
        date_of_birth,
        nationality,
        position,
      } = req.body;

      const result = await this.userService.createUser({
        email,
        password,
        role_id,
        khmer_name,
        english_name,
        date_of_birth,
        nationality,
        position,
      });

      res.status(201).json({ message: "A new user was created.", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}
