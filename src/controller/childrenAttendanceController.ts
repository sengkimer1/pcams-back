import { Request, Response, NextFunction } from "express";
import { ChildAttendanceService } from "../services/childAttendanceServices";

export class ChildAttendanceController {
  constructor(private service: ChildAttendanceService) {}

  async createChildAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id } = req.body;
      const attendance = await this.service.createChildAttendance({ fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id });
      res.status(201).json({ data: attendance });
    } catch (err) {
      next(err);
    }
  }

  async getAllChildAttendances(req: Request, res: Response, next: NextFunction) {
    try {
      const attendances = await this.service.getAllChildAttendances();
      res.status(200).json({ data: attendances });
    } catch (err) {
      next(err);
    }
  }

  async getChildAttendanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const attendance = await this.service.getChildAttendanceById(id);
      res.status(200).json({ data: attendance });
    } catch (err) {
      next(err);
    }
  }

  async updateChildAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, state } = req.params;
      const attendance = await this.service.updateChildAttendance(id, { status: state as "Present" | "Absent" });
      res.status(200).json({ data: attendance });
    } catch (err) {
      next(err);
    }
  }

  async deleteChildAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.service.deleteChildAttendance(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async getChildAttendanceByDateAndUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, user_id } = req.query; // Extract date and user_id from query parameters
      const attendances = await this.service.getChildAttendanceByDateAndUser(
        date as string | null,
        user_id as string | null
      );
      res.status(200).json({ data: attendances });
    } catch (err) {
      next(err);
    }
  }
}