import { Request, Response } from "express";
import { DashboardService } from "../services/dashboardService";

export class DashboardController {
  constructor(private coordinatorService: DashboardService) {}

  async getAttendanceSummary(req: Request, res: Response): Promise<void> {
    try {
      const { Date } = req.query;

      if (!Date || typeof Date !== "string") {
        res.status(400).json({ message: "Date query parameter is required and must be a string." });
        return;
      }

      const summary = await this.coordinatorService.getAttendanceSummary(Date);
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAdminCampSummary(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate || typeof startDate !== "string" || typeof endDate !== "string") {
        res.status(400).json({ 
          message: "startDate and endDate query parameters are required and must be strings." 
        });
        return;
      }

      const summary = await this.coordinatorService.getAdminCampSummary(startDate, endDate);
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching admin camp summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}