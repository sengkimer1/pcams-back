import { Request, Response } from "express";
import { AttendanceTrackingService } from "../interfaces/attendanceTracking";

export class AttendanceTrackingController {
  constructor(private service: AttendanceTrackingService) {}

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const updateStatus = await this.service.updateStatus(id, req.body.status);
    if (!updateStatus) {
        res.status(404).json({ message: "Attendance record not found" });
        return;
    }
    try {
        const updatedStatus = await this.service.updateStatus(id, req.body.status);
        res.status(200).json(updatedStatus);

  
    } catch (error) {
      res.status(500).json({ message: "Error updating status", error });
    }
  }
}