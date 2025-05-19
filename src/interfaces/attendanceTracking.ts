export interface AttendanceTracking {
    id?: string;
    children_id?: string;
    monitor_user_id?: string;
    attendance_date?: Date;
    description?: string;
    status?: "present" | "absent" | "late";
  }
  
  export interface AttendanceTrackingRepository {
    updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null>;
  }
  
  export interface AttendanceTrackingService {
    updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null>;
  }