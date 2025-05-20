export interface DashboardParams {
    campId: string;
    startDate: string; // ISO date string
    endDate: string;
  }
  
  // export interface AttendanceStats {
  //   present: number;
  //   absent: number;
  //   late: number;
  // }
  export type AttendanceStats = Record<string, number>;
  export interface DashboardData {
    totalCoordinators: number;
    totalMonitors: number;
    totalChildren: number;
    attendance: AttendanceStats;
  }
 