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

  async findByAttendanceDate(attendance_date: Date): Promise<ChildAttendance[]> {
    const { rows } = await this.pool.query(
      `SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at 
       FROM child_attendance 
       WHERE attendance_date = $1`,
      [attendance_date]
    );
    return rows;
  }

  async findByUserId(user_id: string): Promise<ChildAttendance[]> {
    const { rows } = await this.pool.query(
      `SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at 
       FROM child_attendance 
       WHERE user_id = $1`,
      [user_id]
    );
    return rows;
  }

  async findByDateAndUserId(attendance_date: Date | null, user_id: string | null): Promise<ChildAttendance[]> {
    let query = `SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at 
                 FROM child_attendance`;
    const conditions: string[] = [];
    const values: (Date | string)[] = [];
    let paramIndex = 1;

    if (attendance_date) {
      conditions.push(`attendance_date = $${paramIndex}`);
      values.push(attendance_date);
      paramIndex++;
    }

    if (user_id) {
      conditions.push(`user_id = $${paramIndex}`);
      values.push(user_id);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const { rows } = await this.pool.query(query, values);
    return rows;
  }
}