import { Request, Response, NextFunction } from "express";
import { IUserService, UserRole } from "../interfaces/userinterfaces";
import { logger } from "../services/loggerService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { CampEventOrganizerService } from "../services/campEventOrganizerService";



export class UserController {
  constructor(
    private userService: IUserService,
    private campEventOrganizerService: CampEventOrganizerService

  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role, username, nationality, created_at } = req.body;

      if (!email || !password || !role) {
        throw Object.assign(new Error("Email, password, and role are required"), { status: 400 });
      }

      if (!Object.values(UserRole).includes(role)) {
        throw Object.assign(new Error("Invalid role"), { status: 400 });
      }

      const result = await this.userService.createUser({
        email,
        password,
        role,
        username,
        nationality,
        created_at: created_at ? new Date(created_at) : new Date(),
      });

      logger.info("User created", { email });
      res.status(201).json({ message: "A new user was created.", data: result });
    } catch (err) {
      logger.error("Error in createUser", { error: err instanceof Error ? err.message : "Unknown error" });
      next(err);
    }
  }

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      logger.info("Fetched all users");
      res.status(200).json(users);
    } catch (err) {
      logger.error("Error in getAllUser", { error: err instanceof Error ? err.message : "Unknown error" });
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      logger.info("Fetched user by id", { id });
      res.status(200).json(user);
    } catch (err) {
      logger.error("Error in getUserById", { error: err instanceof Error ? err.message : "Unknown error", id: req.params.id });
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updateData = req.body;
      if (updateData.role && !Object.values(UserRole).includes(updateData.role)) {
        throw Object.assign(new Error("Invalid role"), { status: 400 });
      }
      const updatedUser = await this.userService.updateUser(id, updateData);

      logger.info("User updated", { id });
      res.status(200).json({ message: "User updated", data: updatedUser });
    } catch (err) {
      logger.error("Error in updateUser", { error: err instanceof Error ? err.message : "Unknown error", id: req.params.id });
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this.userService.deleteUser(id);

      logger.info("User deleted", { id });
      res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
      logger.error("Error in deleteUser", { error: err instanceof Error ? err.message : "Unknown error", id: req.params.id });
      next(err);
    }
  }

  async getOneUserByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleName = req.params.roleName as UserRole;
      if (!Object.values(UserRole).includes(roleName)) {
        throw Object.assign(new Error("Invalid role"), { status: 400 });
      }
      const user = await this.userService.getOneUserByRole(roleName);
      logger.info("Fetched user by role", { role: roleName });
      res.status(200).json(user);
    } catch (err) {
      logger.error("Error in getOneUserByRole", { error: err instanceof Error ? err.message : "Unknown error", role: req.params.roleName });
      next(err);
    }
  }
  async getUserbycamp(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    const campEvents = await this.campEventOrganizerService.getCampEventsByUserId(userId);
    const camp_event_id = campEvents?.[0]?.id;

    if (!camp_event_id) {
      res.status(400).json({ message: 'Camp event ID not found for user' });
      return;
    }

    const user = await this.userService.getUserbycamp(camp_event_id);

    logger.info("Fetched user by camp_event_id", { camp_event_id });

    res.status(200).json(user); // ✅ don't return this line
  } catch (err) {
    logger.error("Error in getUserbycamp", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
    next(err);
  }
}

  
  
}