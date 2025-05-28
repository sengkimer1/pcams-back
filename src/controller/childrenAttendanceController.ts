import { Request, Response, NextFunction } from "express";
import { ChildAttendanceService } from "../services/childAttendanceServices";
import { AuthRequest } from "../middlewares/authMiddleware";

export class ChildAttendanceController {
  constructor(private service: ChildAttendanceService) {}


  async createChildAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { fullname, gender, age, family_id, attendance_date, status, camp_event_id } = req.body;
      const user_id = req.user?.id; // Extract user_id from token
      if (!user_id) {
        throw new Error("User ID not found in token");
      }
      const attendance = await this.service.createChildAttendance({
        fullname,
        gender,
        age,
        family_id,
        attendance_date,
        status,
        camp_event_id,
        user_id,
      });
      res.status(201).json({ data: attendance });
    } catch (err) {
      next(err);
    }
  }

  async getAllChildAttendances(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId} = req.params;
      const attendances = await this.service.getAllChildAttendances(userId);
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
      const { id } = req.params;
      const { status } = req.body;
  
      const attendance = await this.service.updateChildAttendance(id, {
        status: status as "Present" | "Absent",
      });
  
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
      const { date, user_id } = req.query;
      const attendances = await this.service.getChildAttendanceByDateAndUser(
        date as string | null,
        user_id as string | null
      );
      res.status(200).json({ data: attendances });
    } catch (err) {
      next(err);
    }
  }
  async createChildAttendanceList(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { attendance_date, organizer_id } = req.body;
  
      if (!organizer_id) {
        throw new Error("organizer_id is required");
      }
  
      // Validate the format: YYYY-MM-DD
      const date = new Date(attendance_date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid attendance_date format. Use YYYY-MM-DD");
      }
  
      // Convert it back to 'YYYY-MM-DD' string to pass to service
      const formattedDate = date.toISOString().split('T')[0];
  
      const result = await this.service.createChildAttendanceList(organizer_id, formattedDate);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
  
  
}