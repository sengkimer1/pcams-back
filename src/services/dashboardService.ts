import { DashboardAttendanceSummary, DashboardRepository, AdminCampSummary } from "../interfaces/dashboardInterface";

export class DashboardService {
  constructor(private coordinatorRepo: DashboardRepository) {}

  async getAttendanceSummary(date: string): Promise<DashboardAttendanceSummary> {
    return this.coordinatorRepo.getByDateRange(date);
  }

  async getAdminCampSummary(startDate: string, endDate: string): Promise<AdminCampSummary> {
    return this.coordinatorRepo.getAdminCampSummary(startDate, endDate);
  }
}