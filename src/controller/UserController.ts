import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { IUser } from "../interfaces/userinterfaces";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password,
        position,
        khmer_name,
        english_name,
        date_of_birth,
        nationality,
        camp_id,
      } = req.body;

      if (!camp_id) {
        throw Object.assign(new Error("Camp ID is required"), { status: 400 });
      }

      if (!position) {
        throw Object.assign(new Error("Position is required"), { status: 400 });
      }

      if (!email || !password || !khmer_name || !english_name || !date_of_birth || !nationality) {
        throw Object.assign(new Error("All required fields must be provided"), { status: 400 });
      }

      const userData: Omit<IUser, "id"> = {
        email,
        password,
        position,
        khmer_name,
        english_name,
        date_of_birth,
        nationality,
        camp_id,
      };

      const result = await this.userService.createUser(userData);

      res.status(201).json({ message: "A new user was created.", data: result });
    } catch (err) {
      console.error("Error in createUser:", err);
      next(err);
    }
  }

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const updatedUser = await this.userService.updateUser(id, updateData);

      res.status(200).json({ message: "User updated", data: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this.userService.deleteUser(id);

      res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getOneUserByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleName = req.params.roleName;
      const user = await this.userService.getOneUserByRole(roleName);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}