import { AttendanceTracking, AttendanceTrackingRepository, AttendanceTrackingService } from "../interfaces/attendanceTracking";

export class AttendanceTrackingServiceImpl implements AttendanceTrackingService {
  constructor(private repository: AttendanceTrackingRepository) {}

  async updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null> {
    return this.repository.updateStatus(id, status);
  }

  async create(data: AttendanceTracking): Promise<AttendanceTracking> {
    return this.repository.create(data);
  }

  async getAttendanceByStatus(status: "present" | "absent" | "late"): Promise<AttendanceTracking[]> {
    return this.repository.getAttendanceByStatus(status);
  }
  async getGroupAttendanceSummary(): Promise<any[]> {
    return this.repository.getGroupAttendanceSummary();
  }
}
