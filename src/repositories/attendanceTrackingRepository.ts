import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
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

  async create(data: AttendanceTracking): Promise<AttendanceTracking> {
    const id = uuidv4();
    const { children_id, tracker_id, attendance_date, description, status } = data;
    const { rows } = await this.pool.query(
      `INSERT INTO children_attendance (id, children_id, tracker_id, attendance_date, description, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, children_id, tracker_id, attendance_date, description, status || "present"]
    );
    return rows[0];
  }
}