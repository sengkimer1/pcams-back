import { Request, Response, NextFunction } from "express";
import { ChildService } from "../services/childrenService";

export class ChildController {
  constructor(private childService: ChildService) {}

  // POST /children
  async createChild(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        english_name,
        khmer_name,
        family_id,
        age,
        gender,
        image_url,
        registered_date,
        description,
        camp_id,
        status,
      } = req.body;

      const result = await this.childService.createChild({
        english_name,
        khmer_name,
        family_id,
        age,
        gender,
        image_url,
        registered_date,
        description,
        camp_id,
        status
      });

      res.status(201).json({ message: "A new child was created.", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  // GET /children
  async getAllChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const children = await this.childService.getAllChildren();
      res.status(200).json(children);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  // GET /children/:id
  async getChildById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const child = await this.childService.getChildById(id);
      res.status(200).json(child);
    } catch (error) {
      next(error);
    }
  }

  // GET /children/camp/:campId
  async getChildrenByCampId(req: Request, res: Response, next: NextFunction) {
    try {
      const { campId } = req.params;
      const children = await this.childService.getChildrenByCampId(campId);
      res.status(200).json(children);
    } catch (error) {
      next(error);
    }
  }

  // PUT /children/:id
  async updateChild(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updatedChild = await this.childService.updateChild(id, req.body);
      res.status(200).json(updatedChild);
    } catch (error) {
      next(error);
    }
  }
  // DELETE /children/:id
  async deleteChild(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.childService.deleteChild(id);
      res.status(200).json({ message: "Child deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
