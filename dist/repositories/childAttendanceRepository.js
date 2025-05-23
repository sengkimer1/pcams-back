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
        const { fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id } = data;
        const { rows } = await this.pool.query(`INSERT INTO child_attendance (id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, now, now]);
        return rows[0];
    }
    async findAll() {
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at FROM child_attendance`);
        return rows;
    }
    async findById(id) {
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at FROM child_attendance WHERE id = $1`, [id]);
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
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at 
       FROM child_attendance 
       WHERE attendance_date = $1`, [attendance_date]);
        return rows;
    }
    async findByUserId(user_id) {
        const { rows } = await this.pool.query(`SELECT id, fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id, created_at, updated_at 
       FROM child_attendance 
       WHERE user_id = $1`, [user_id]);
        return rows;
    }
}
exports.PostgresChildAttendanceRepository = PostgresChildAttendanceRepository;
