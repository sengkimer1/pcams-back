"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDashboardRepository = void 0;
class PostgresDashboardRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async getByDateRange(date) {
        const totalRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS total
       FROM child_attendance
       WHERE attendance_date = $1`, [date]);
        const presentRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS present
       FROM child_attendance
       WHERE status = 'Present' AND attendance_date = $1`, [date]);
        const absentRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS absent
       FROM child_attendance
       WHERE status = 'Absent' AND attendance_date = $1`, [date]);
        return {
            totalChildren: parseInt(totalRes.rows[0].total, 10),
            presentChildren: parseInt(presentRes.rows[0].present, 10),
            absentChildren: parseInt(absentRes.rows[0].absent, 10),
        };
    }
    async getAdminCampSummary(startDate, endDate) {
        const coordinatorsRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS total
       FROM users
       WHERE role = 'coordinator' AND created_at BETWEEN $1 AND $2`, [startDate, endDate]);
        const monitorsRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS total
       FROM users
       WHERE role = 'monitor' AND created_at BETWEEN $1 AND $2`, [startDate, endDate]);
        const childrenRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS total
       FROM child_attendance
       WHERE created_at BETWEEN $1 AND $2`, [startDate, endDate]);
        const totalAttendanceRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS total
       FROM child_attendance
       WHERE attendance_date BETWEEN $1 AND $2`, [startDate, endDate]);
        const presentAttendanceRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS present
       FROM child_attendance
       WHERE status = 'Present' AND attendance_date BETWEEN $1 AND $2`, [startDate, endDate]);
        const absentAttendanceRes = await this.pool.query(`SELECT COUNT(DISTINCT id) AS absent
       FROM child_attendance
       WHERE status = 'Absent' AND attendance_date BETWEEN $1 AND $2`, [startDate, endDate]);
        return {
            totalCoordinators: parseInt(coordinatorsRes.rows[0].total, 10),
            totalMonitors: parseInt(monitorsRes.rows[0].total, 10),
            totalChildren: parseInt(childrenRes.rows[0].total, 10),
            attendanceSummary: {
                totalChildren: parseInt(totalAttendanceRes.rows[0].total, 10),
                presentChildren: parseInt(presentAttendanceRes.rows[0].present, 10),
                absentChildren: parseInt(absentAttendanceRes.rows[0].absent, 10),
            }
        };
    }
}
exports.PostgresDashboardRepository = PostgresDashboardRepository;
