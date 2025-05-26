export interface DashboardAttendanceSummary {
  totalChildren: number;
  presentChildren: number;
  absentChildren: number;
}

export interface AdminCampSummary {
  totalCoordinators: number;
  totalMonitors: number;
  totalChildren: number;
  attendanceSummary: DashboardAttendanceSummary;
}

export interface DashboardRepository {
  getByDateRange(date: string): Promise<DashboardAttendanceSummary>;
  getAdminCampSummary(startDate: string, endDate: string): Promise<AdminCampSummary>;
}