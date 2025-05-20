import { Request, Response, RequestHandler } from 'express';
import { DashboardService } from '../services/dashboardService';
import { DashboardParams } from '../interfaces/dashboardInterface';

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  getDashboard: RequestHandler = async (req, res) => {
    try {
      const { campId, startDate, endDate } = req.query;

      if (!campId || !startDate || !endDate) {
        res.status(400).json({ error: 'campId, startDate, and endDate are required' });
        return;  // explicitly return void here
      }

      const params: DashboardParams = {
        campId: campId.toString(),
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      };

      const data = await this.dashboardService.getDashboardData(params);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
