import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";

export class UserController {
  constructor(private userService: UserService) { }

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
  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getAllUsers();
      res.status(200).json(user);
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
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}
