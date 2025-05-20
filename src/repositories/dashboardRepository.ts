import { Pool } from 'pg';
import { DashboardParams, AttendanceStats } from '../interfaces/dashboardInterface';
import { queryWithLogging } from './utils'; // your helper to run queries with logs

export class PostgresDashboardRepository {
  constructor(private pool: Pool) { }

  async getTotalChildren(campId: string): Promise<number> {
    const result = await queryWithLogging(
      this.pool,
      `SELECT COUNT(id) AS count
       FROM children
       WHERE camp_id = $1`,
      [campId]
    );
    return Number(result.rows[0]?.count ?? 0);
  }

  async getTotalCoordinators(campId: string): Promise<number> {
    const result = await queryWithLogging(
      this.pool,
      `SELECT COUNT(u.id) AS count
       FROM Users u
       JOIN Camp_Character cc ON cc.user_id = u.id
       JOIN Role r ON r.id = u.role_id
       WHERE cc.camp_id = $1 AND r.name = 'coordinator' AND cc.is_active = true`,
      [campId]
    );
    return Number(result.rows[0]?.count ?? 0);
  }

  async getTotalMonitors(campId: string): Promise<number> {
    const result = await queryWithLogging(
      this.pool,
      `SELECT COUNT(u.id) AS count
       FROM Users u
       JOIN Camp_Character cc ON cc.user_id = u.id
       JOIN Role r ON r.id = u.role_id
       WHERE cc.camp_id = $1 AND r.name = 'monitor' AND cc.is_active = true`,
      [campId]
    );
    return Number(result.rows[0]?.count ?? 0);
  }


  async getAttendanceStats(params: DashboardParams): Promise<AttendanceStats> {
    const { campId, startDate, endDate } = params;

    const result = await queryWithLogging(
      this.pool,
      `SELECT children_attendance.status, COUNT(children_attendance.id) AS count
       FROM children_attendance
       JOIN children ON children_attendance.children_id = children.id
       WHERE children.camp_id = $1
         AND children_attendance.attendance_date BETWEEN $2 AND $3
       GROUP BY children_attendance.status`,
      [campId, startDate, endDate]
    );

    const stats: AttendanceStats = {};

    for (const row of result.rows) {
      stats[row.status] = Number(row.count);
    }

    return stats;
  }
}
