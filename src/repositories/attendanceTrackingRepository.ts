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
    const { children_id, monitor_user_id, attendance_date, description, status } = data;
    const { rows } = await this.pool.query(
      `INSERT INTO children_attendance (id, children_id, monitor_user_id, attendance_date, description, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, children_id, monitor_user_id, attendance_date, description, status || "present"]
    );
    return rows[0];
  }
  async getAttendanceByStatus(status: "present" | "absent" | "late"): Promise<AttendanceTracking[]> {
    const { rows } = await this.pool.query(
      `SELECT * FROM children_attendance WHERE status = $1`,
      [status]
    );
    
    return rows;
  }
  async getGroupAttendanceSummary(): Promise<any[]> {
    const { rows } = await this.pool.query(`
      SELECT 
        c.id AS camp_id,
        c.camp_name,
        COUNT(DISTINCT ch.id) AS total_children,
        COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'present') AS present_count,
        COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'absent') AS absent_count
      FROM 
        Camp c
      LEFT JOIN 
        Children ch ON ch.camp_id = c.id
      LEFT JOIN 
        Children_Attendance ca ON ca.children_id = ch.id
      GROUP BY 
        c.id, c.camp_name
      ORDER BY 
        c.camp_name
    `);
    return rows;
  }
  

}