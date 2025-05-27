"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresChildAttendanceRepository = void 0;
const uuid_1 = require("uuid");
class PostgresChildAttendanceRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const { fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, } = data;
        const parsedAttendanceDate = new Date(attendance_date);
        if (isNaN(parsedAttendanceDate.getTime())) {
            throw new Error("Invalid attendance_date");
        }
        const { rows } = await this.pool.query(`INSERT INTO child_attendance (
         id, fullname, gender, age, family_id, attendance_date,
         status, camp_event_id, user_id, created_at, updated_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
       ) RETURNING *`, [id, fullname, gender, age, family_id, parsedAttendanceDate, status, camp_event_id, user_id, now, now]);
        return rows[0];
    }
    // async findAll(): Promise<ChildAttendance[]> {
    //   const { rows } = await this.pool.query(
    //     `SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at FROM child_attendance`
    //   );
    //   return rows;
    // }
    async findAll() {
        const { rows } = await this.pool.query(`SELECT 
         ca.id, ca.fullname, ca.gender, ca.age, ca.family_id, 
         ca.attendance_date, ca.status, ca.camp_event_id, ca.user_id, 
         ca.created_at, ca.updated_at,
         u.id as user_id, u.username, u.email
       FROM child_attendance ca
       JOIN users u ON ca.user_id = u.id`);
        return rows;
    }
    async findById(id) {
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id,  created_at, updated_at FROM child_attendance WHERE id = $1`, [id]);
        return rows[0] || null;
    }
    async update(id, data) {
        const now = new Date();
        const setClause = Object.keys(data)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(", ");
        const values = [id, ...Object.values(data), now];
        const { rows } = await this.pool.query(`UPDATE child_attendance SET ${setClause}, updated_at = $${values.length} WHERE id = $1 RETURNING *`, values);
        if (!rows[0])
            throw new Error("Child attendance record not found");
        return rows[0];
    }
    async delete(id) {
        const { rowCount } = await this.pool.query(`DELETE FROM child_attendance WHERE id = $1`, [id]);
        if (rowCount === 0)
            throw new Error("Child attendance record not found");
    }
    async findByAttendanceDate(attendance_date) {
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id,  created_at, updated_at 
       FROM child_attendance 
       WHERE attendance_date = $1`, [attendance_date]);
        return rows;
    }
    async findByUserId(user_id) {
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id,  created_at, updated_at 
       FROM child_attendance 
       WHERE user_id = $1`, [user_id]);
        return rows;
    }
    async findByDateAndUserId(attendance_date, user_id) {
        let query = `
      SELECT 
        ca.id, ca.fullname, ca.gender, ca.age, ca.family_id, 
        ca.attendance_date, ca.status, ca.camp_event_id, 
        ca.created_at, ca.updated_at,
        u.username,
        u.email 
      FROM child_attendance ca
      JOIN users u ON ca.user_id = u.id
    `;
        const conditions = [];
        const values = [];
        let paramIndex = 1;
        if (attendance_date) {
            conditions.push(`ca.attendance_date = $${paramIndex}`);
            values.push(attendance_date);
            paramIndex++;
        }
        if (user_id) {
            conditions.push(`ca.user_id = $${paramIndex}`);
            values.push(user_id);
            paramIndex++;
        }
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }
        const { rows } = await this.pool.query(query, values);
        return rows; // Return directly if your ChildAttendance type includes username/email
    }
    async createChildAttendanceList(organizer_id) {
        const attendance_date = new Date(); // Set to today's date
        const { rows } = await this.pool.query(`
      INSERT INTO child_attendance (
         id, fullname, gender, age, family_id,
         attendance_date, camp_event_id, user_id,
         created_at, updated_at
       )
       SELECT 
         gen_random_uuid(), fullname, gender, age, family_id,
         $1, camp_event_id, user_id,
         NOW(), NOW()
       FROM child_attendance
       WHERE user_id = $2
       RETURNING *`, [attendance_date, organizer_id]);
        return rows;
    }
}
exports.PostgresChildAttendanceRepository = PostgresChildAttendanceRepository;
