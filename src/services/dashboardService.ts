import { DashboardParams, DashboardData } from '../interfaces/dashboardInterface';
import { PostgresDashboardRepository } from '../repositories/dashboardRepository';

export class DashboardService {
  constructor(private dashboardRepository: PostgresDashboardRepository) {}

  async getDashboardData(params: DashboardParams): Promise<DashboardData> {
    const [totalCoordinators, totalMonitors, totalChildren, attendance] = await Promise.all([
      this.dashboardRepository.getTotalCoordinators(params.campId),
      this.dashboardRepository.getTotalMonitors(params.campId),
      this.dashboardRepository.getTotalChildren(params.campId),
      this.dashboardRepository.getAttendanceStats(params),
    ]);

    return {
      totalCoordinators,
      totalMonitors,
      totalChildren,
      attendance,
    };
  }
}
