import { Request, Response, NextFunction } from "express";
import { ICampEventService } from "../interfaces/campEventInterface";
import { logger } from "../services/loggerService";

export class CampEventController {
  constructor(private campEventService: ICampEventService) {}

  async createCampEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { camp_id, event_id, created_at } = req.body;

      if (!camp_id || !event_id) {
        throw Object.assign(new Error("camp_id and event_id are required"), { status: 400 });
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

      const newCampEvent = await this.campEventService.createCampEvent({
        camp_id,
        event_id,
        created_at: createdAt,
      });

      logger.info("Camp-event created", { id: newCampEvent.id, camp_id: newCampEvent.camp_id, event_id: newCampEvent.event_id });
      res.status(201).json({ message: "Camp-event association created successfully", data: newCampEvent });
    } catch (err) {
      logger.error("Error in createCampEvent", { error: err instanceof Error ? err.message : String(err) });
      next(err);
    }
  }

  async getAllCampEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const campEvents = await this.campEventService.getAllCampEvents();
      logger.info("Fetched all camp-event associations");
      res.status(200).json(campEvents);
    } catch (err) {
      logger.error("Error in getAllCampEvents", { error: err instanceof Error ? err.message : String(err) });
      next(err);
    }
  }
}