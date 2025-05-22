import { Request, Response, NextFunction } from "express";
import { ICampService } from "../interfaces/campInterfaces";
import { logger } from "../services/loggerService";

export class CampController {
  constructor(private campService: ICampService) {}

  async createCamp(req: Request, res: Response, next: NextFunction) {
    try {
      const { camp_name, camp_location, created_at } = req.body;

      if (!camp_name || !camp_location) {
        throw Object.assign(new Error("camp_name and camp_location are required"), { status: 400 });
      }

      // Validate created_at if provided
      let createdAt: Date;
      if (created_at) {
        createdAt = new Date(created_at);
        if (isNaN(createdAt.getTime())) {
          throw Object.assign(new Error("Invalid date format for created_at"), { status: 400 });
        }
      } else {
        createdAt = new Date();
      }

      const newCamp = await this.campService.createCamp({
        camp_name,
        camp_location,
        created_at: createdAt,
      });

      logger.info("Camp created", { id: newCamp.id });
      res.status(201).json({ message: "Camp created successfully", data: newCamp });
    } catch (err) {
      logger.error("Error in createCamp", { error: err instanceof Error ? err.message : String(err) });
      next(err);
    }
  }

  async getAllCamps(req: Request, res: Response, next: NextFunction) {
    try {
      const camps = await this.campService.getAllCamps();
      logger.info("Fetched all camps");
      res.status(200).json(camps);
    } catch (err) {
      logger.error("Error in getAllCamps", { error: err instanceof Error ? err.message : String(err) });
      next(err);
    }
  }

  async getCampById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const camp = await this.campService.getCampById(id);
      logger.info("Fetched camp by id", { id });
      res.status(200).json(camp);
    } catch (err) {
      logger.error("Error in getCampById", { error: err instanceof Error ? err.message : String(err), id: req.params.id });
      next(err);
    }
  }
}