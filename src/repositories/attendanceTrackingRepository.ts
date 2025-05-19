import { Pool } from "pg";
import { AttendanceTracking, AttendanceTrackingRepository } from "../interfaces/attendanceTracking";

export class PostgresAttendanceTrackingRepository implements AttendanceTrackingRepository {
  constructor(private pool: Pool) {}

  async updateStatus(id: string, status: "present" | "absent" | "late"): Promise<AttendanceTracking | null> {
    const { rows } = await this.pool.query(
      `UPDATE children_attendance 
       SET status = $1 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  }
}