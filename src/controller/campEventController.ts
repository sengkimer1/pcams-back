import { Request, Response } from "express";
import { CampEventService } from "../services/campsEventsSerivce";

export class CampEventController {
    constructor(private campEventService: CampEventService) {}

    async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const newEvent = await this.campEventService.create(data);
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(500).json({ message: "Failed to create camp event", error });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const events = await this.campEventService.findAll();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch camp events", error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const event = await this.campEventService.findById(id);
            if (!event) {
                return res.status(404).json({ message: "Not found" });
            }
            return res.status(200).json(event);
        } catch (err) {
            return res.status(500).json({ message: "Server error", err });
        }
    }

    // async update(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    //         const data = req.body;
    //         const updated = await this.campEventService.update(id, data);
    //         if (!updated) {
    //             return res.status(404).json({ message: "Event not found" });
    //         }
    //         return res.status(200).json(updated);
    //     } catch (err) {
    //         return res.status(500).json({ message: "Failed to update event", err });
    //     }
    // }

    // async delete(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    //         const deleted = await this.campEventService.delete(id);
    //         if (!deleted) {
    //             return res.status(404).json({ message: "Event not found" });
    //         }
    //         return res.status(200).json({ message: "Deleted successfully" });
    //     } catch (err) {
    //         return res.status(500).json({ message: "Failed to delete event", err });
    //     }
    // }
}
