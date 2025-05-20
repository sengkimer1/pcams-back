import { Request, Response } from "express";
import { CampUserService } from "../interfaces/campUserInterface";
import { AuthRequest } from "../middlewares/authMiddleware";

export class CampUserController {
  constructor(private service: CampUserService) {}

  async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    console.log("req.user:", req.user); // Debug log to inspect req.user
    const data = req.body;

    if (!data.camp_id || !data.user_id || data.is_active === undefined || data.is_active === null) {
      res.status(400).json({ message: "Missing required fields: camp_id, user_id, is_active" });
      return;
    }

    const campUserData = {
      ...data,
    };

    try {
      const newRecord = await this.service.create(campUserData);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ message: "Error creating camp user record", error });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const records = await this.service.findAll();
      res.status(200).json(records);
    } catch (error) {
      res.status(500).json({ message: "Error fetching camp users", error });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const record = await this.service.findById(id);
      if (!record) {
        res.status(404).json({ message: "Camp user not found" });
        return;
      }
      res.status(200).json(record);
    } catch (error) {
      res.status(500).json({ message: "Error fetching camp user", error });
    }
  }
}