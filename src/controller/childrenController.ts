import { Request, Response, NextFunction } from "express";
import { ChildService } from "../services/childrenService";

export class ChildController {
  constructor(private childService: ChildService) {}

  // POST /children
  async createChild(req: Request, res: Response,next: NextFunction) {
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
     });
     res.status(201).json({ message: "A new children was created." , data:result });
    } catch(err){
        console.error(err);
        next(err);

    }
  }

  async getAllChildren(req: Request, res: Response,next:NextFunction) {
    try {
      const children = await this.childService.getAllChildren();
      res.status(200).json(children);
    } catch (err) {
        console.error(err);
        next(err)
        }
  }


  async getChildById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const child = await this.childService.getChildById(id);
      res.status(200).json(child);
    } catch (error) {
        next(error);
      }
  }
  


  async getChildrenByCampId(req: Request, res: Response ,next:NextFunction) {
    try {
      const { campId } = req.params;
      const children = await this.childService.getChildrenByCampId(campId);
      res.status(200).json(children);
    } catch (error) {
        next(error);
      }
  }
}
