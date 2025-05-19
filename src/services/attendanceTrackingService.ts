import { AttendanceTracking, AttendanceTrackingRepository, AttendanceTrackingService } from "../interfaces/attendanceTracking";

export class PostgresAttendanceTrackingService implements AttendanceTrackingService {
  constructor(private repository: AttendanceTrackingRepository) {}

  async updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null> {
    return this.repository.updateStatus(id, status);
  }
}