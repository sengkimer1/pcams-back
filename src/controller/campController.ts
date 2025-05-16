import { Request, Response, RequestHandler } from "express";
import { CampService } from "../services/campServices";

export class CampController {
  constructor(private service: CampService) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const newCamp = await this.service.create(req.body);
      res.status(201).json(newCamp);
    } catch (err) {
      res.status(500).json({ message: "Failed to create camp", error: err });
    }
  };

  getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const camps = await this.service.findAll();
      res.status(200).json(camps);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch camps", error: err });
    }
  };

  getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const camp = await this.service.findById(id);
      if (!camp) {
        res.status(404).json({ message: "Camp not found" });
        return;
      }
      res.status(200).json(camp);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  };

  update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedCamp = await this.service.update(id, req.body);
      if (!updatedCamp) {
        res.status(404).json({ message: "Camp not found" });
        return;
      }
      res.status(200).json(updatedCamp);
    } catch (err) {
      res.status(500).json({ message: "Failed to update camp", error: err });
    }
  };

  delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.service.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "camp not found" });
        return;
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete camp", err });
    }
  };
}