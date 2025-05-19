import { Request, Response } from "express";
import { AttendanceTrackingService } from "../interfaces/attendanceTracking";
import { AuthRequest } from "../middlewares/authMiddleware";

export class AttendanceTrackingController {
  constructor(private service: AttendanceTrackingService) {}

  async updateStatus(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!["present", "absent", "late"].includes(status)) {
      res.status(400).json({ message: "Invalid status value. Must be 'present', 'absent', or 'late'." });
      return;
    }

    try {
      const updated = await this.service.updateStatus(id, status as "present" | "absent" | "late");
      if (!updated) {
        res.status(404).json({ message: "Attendance record not found" });
        return;
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating status", error });
    }
  }

  async create(req: AuthRequest, res: Response) {
    const data = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }

    if (!data.children_id || !data.attendance_date || !data.status) {
      res.status(400).json({ message: "Missing required fields: children_id, attendance_date, status" });
      return;
    }

    if (!["present", "absent", "late"].includes(data.status)) {
      res.status(400).json({ message: "Invalid status value. Must be 'present', 'absent', or 'late'." });
      return;
    }

    const attendanceDate = new Date(data.attendance_date);
    if (isNaN(attendanceDate.getTime())) {
      res.status(400).json({ message: "Invalid attendance_date format. Must be a valid date." });
      return;
    }

    const attendanceData = {
      ...data,
      attendance_date: attendanceDate,
      tracker_id: req.user.id, // Extract tracker_id from token
    };

    try {
      const newRecord = await this.service.create(attendanceData);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ message: "Error creating attendance record", error });
    }
  }
}