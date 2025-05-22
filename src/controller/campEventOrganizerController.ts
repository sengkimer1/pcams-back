import { Request, Response, NextFunction } from "express";
import { CampEventOrganizerService } from "../services/campEventOrganizerService";

export class CampEventOrganizerController {
  constructor(private service: CampEventOrganizerService) {}

  async createCampEventOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const { camp_event_id, user_id } = req.body;
      if (!camp_event_id || !user_id) {
        throw new Error("camp_event_id and user_id are required");
      }
      const organizer = await this.service.createCampEventOrganizer({ camp_event_id, user_id });
      res.status(201).json({ message: "Camp event organizer created", data: organizer });
    } catch (err) {
      next(err);
    }
  }

  async getAllCampEventOrganizers(req: Request, res: Response, next: NextFunction) {
    try {
      const organizers = await this.service.getAllCampEventOrganizers();
      res.status(200).json(organizers);
    } catch (err) {
      next(err);
    }
  }

  async getCampEventOrganizerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const organizer = await this.service.getCampEventOrganizerById(id);
      res.status(200).json(organizer);
    } catch (err) {
      next(err);
    }
  }
}