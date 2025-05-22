export interface DashboardParams {
  campId: string;
  startDate: string; // ISO date string
  endDate: string;
}

export type AttendanceStats = Record<string, number>;

export interface DashboardData {
  totalCoordinators: number;
  totalMonitors: number;
  totalChildren: number;
  attendance: AttendanceStats;
}
