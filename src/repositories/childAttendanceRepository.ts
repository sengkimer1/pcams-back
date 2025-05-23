import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { ChildAttendance, ChildAttendanceRepository } from "../interfaces/childAttendanceInterface";

export class PostgresChildAttendanceRepository implements ChildAttendanceRepository {
  constructor(private pool: Pool) {}

  async create(data: Omit<ChildAttendance, "id" | "created_at" | "updated_at">): Promise<ChildAttendance> {
    const id = uuidv4();
    const now = new Date();
    const { fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id } = data;
    const { rows } = await this.pool.query(
      `INSERT INTO child_attendance (id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, now, now]
    );
    return rows[0];
  }

  async findAll(): Promise<ChildAttendance[]> {
    const { rows } = await this.pool.query(
      `SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at FROM child_attendance`
    );
    return rows;
  }

  async findById(id: string): Promise<ChildAttendance | null> {
    const { rows } = await this.pool.query(
      `SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at FROM child_attendance WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async update(id: string, data: Partial<ChildAttendance>): Promise<ChildAttendance> {
    const now = new Date();
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [id, ...Object.values(data), now];
    const { rows } = await this.pool.query(
      `UPDATE child_attendance SET ${setClause}, updated_at = $${values.length} WHERE id = $1 RETURNING *`,
      values
    );
    if (!rows[0]) throw new Error("Child attendance record not found");
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    const { rowCount } = await this.pool.query(
      `DELETE FROM child_attendance WHERE id = $1`,
      [id]
    );
    if (rowCount === 0) throw new Error("Child attendance record not found");
  }
}