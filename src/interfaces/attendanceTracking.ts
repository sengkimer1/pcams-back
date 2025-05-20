export interface AttendanceTracking {
  id?: string;
  children_id?: string;
  tracker_id?: string; // unified naming for the user who tracks attendance
  attendance_date?: Date;
  description?: string;
  status?: "present" | "absent" | "late";
}

export interface AttendanceTrackingRepository {
  updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null>;
  create(data: AttendanceTracking): Promise<AttendanceTracking>;
  getAttendanceByStatus(status: "present" | "absent" | "late"): Promise<AttendanceTracking[]>;
  getGroupAttendanceSummary(): Promise<any[]>;  // Consider defining a proper type instead of any[]
}

export interface AttendanceTrackingService {
  updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null>;
  create(data: AttendanceTracking): Promise<AttendanceTracking>;
  getAttendanceByStatus(status: "present" | "absent" | "late"): Promise<AttendanceTracking[]>;
  getGroupAttendanceSummary(): Promise<any[]>;  // Same here, prefer a typed result
}
