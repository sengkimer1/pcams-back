import { Request, Response ,NextFunction} from "express";
import { CampService } from "../services/campServices";

export class CampController {
  constructor(private service: CampService) {}

  async create(req: Request, res: Response) {
    try {
      const newCamp = await this.service.create(req.body);
      res.status(201).json(newCamp);
    } catch (err) {
      res.status(500).json({ message: "Failed to create camp", error: err });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const camps = await this.service.findAll();
      res.status(200).json(camps);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch camps", error: err });
    }
  }

  async getById(req: Request, res: Response,next: NextFunction) {
    try {
      const { id } = req.params;
      const camp = await this.service.findById(id);
      res.status(200).json(camp);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedCamp = await this.service.update(req.params.id, req.body);
      if (!updatedCamp) return res.status(404).json({ message: "Camp not found" });
      res.status(200).json(updatedCamp);
    } catch (err) {
      res.status(500).json({ message: "Failed to update camp", error: err });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success) return res.status(404).json({ message: "Camp not found" });
      res.status(200).json({ message: "Camp deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete camp", error: err });
    }
  }
}
