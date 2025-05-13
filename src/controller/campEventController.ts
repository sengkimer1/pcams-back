// controller/campEventController.ts
import { Request, Response } from "express";
import { CampEventService } from "../services/campeventService";

export class CampEventController {
    constructor(private campEventService: CampEventService) { }

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

    getById = async (req: Request, res: Response) => {
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
    };
}
