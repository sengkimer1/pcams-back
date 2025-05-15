import { Request, Response, RequestHandler } from "express";
import { CampEventService } from "../services/campsEventsSerivce"; // ✅ Fixed typo: campsEventsSerivce -> campEventService

export class EventcampController {
  constructor(private campEventService: CampEventService) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newEvent = await this.campEventService.create(data);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to create camp event", error });
    }
  };

  getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const events = await this.campEventService.findAll();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch camp events", error });
    }
  };

  getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await this.campEventService.findById(id);
      if (!event) {
        res.status(404).json({ message: "Camp event not found" });
        return;
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to get camp event", error });
    }
  };

  update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await this.campEventService.update(id, data);
      if (!updated) {
        res.status(404).json({ message: "Event not found" });
        return;
      }
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update event", err });
    }
  };

  delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.campEventService.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Event not found" });
        return;
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete event", err });
    }
  };
}