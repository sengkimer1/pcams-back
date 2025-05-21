export interface CoordinatorAttendanceParams {
  coordinatorId: string;
  startDate: string;
  endDate: string;
}

export interface CoordinatorAttendanceSummary {
  totalChildren: number;
  presentChildren: number;
  absentChildren: number;
}
