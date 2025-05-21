import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService"; // Adjust path as needed
import { IUserService } from "../interfaces/userinterfaces"; // Adjust path as needed

export class UserController {
  constructor(private userService: UserService & IUserService) {}

  async createUserCamp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      // Validate required fields
      if (!userData.email || !userData.password || !userData.camp_id) {
        res.status(400).json({ error: "Email, password, and camp_id are required" });
        return;
      }
      const result = await this.userService.createUserCamp(userData);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getAllUserCamps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userCamps = await this.userService.getAllUserCamps();
      res.status(200).json(userCamps);
    } catch (error: any) {
      next(error);
    }
  }

  async getUserCampById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const userCamp = await this.userService.getUserCampById(id);
      res.status(200).json(userCamp);
    } catch (error: any) {
      if (error.message === "User with camp not found") {
        res.status(404).json({ error: "User not found" });
      } else {
        next(error);
      }
    }
  }
}