import { Response } from "express";
import { CoordinatorAttendanceService } from "../services/coordinatorService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class CoordinatorController {
  constructor(
    private coordinatorAttendanceService: CoordinatorAttendanceService
  ) {}

  async getCoordinatorSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const coordinatorId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!coordinatorId) {
        res.status(401).json({ message: "Unauthorized: Coordinator ID missing" });
        return;
      }

      if (!startDate || !endDate) {
        res
          .status(400)
          .json({ message: "startDate and endDate are required" });
        return;
      }

      const summary = await this.coordinatorAttendanceService.getSummary({
        coordinatorId,
        startDate: String(startDate),
        endDate: String(endDate),
      });

      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching coordinator summary:", error);
      res.status(500).json({ message: "Failed to fetch summary" });
    }
  }
}
