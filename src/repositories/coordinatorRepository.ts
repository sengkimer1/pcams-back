import { Pool } from "pg";
import { queryWithLogging } from "./utils";
import {
  CoordinatorAttendanceParams,
  CoordinatorAttendanceSummary,
} from "../interfaces/coordinatorInterdace";

export class PostgresCoordinatorAttendanceRepository {
  constructor(private pool: Pool) { }

  async getCoordinatorAttendanceSummary(
    params: CoordinatorAttendanceParams
  ): Promise<CoordinatorAttendanceSummary> {
    const { coordinatorId, startDate, endDate } = params;

    // Get all children for coordinator
    const childrenRes = await queryWithLogging(
      this.pool,
      `SELECT ch.id AS child_id, ch.khmer_name, ch.english_name
FROM Children ch
JOIN Camp_User cu ON ch.camp_id = cu.camp_id
WHERE cu.user_id = $1;
`,
      [coordinatorId]
    );

    const children = childrenRes.rows;
    const totalChildren = children.length;
    if (totalChildren === 0) {
      return {
        totalChildren: 0,
        presentChildren: 0,
        absentChildren: 0,
      };
    }

    const childIds = children.map((c: any) => c.child_id);

    // Get attendance records
    const attendanceRes = await queryWithLogging(
      this.pool,
      `SELECT children_id, status
       FROM children_attendance
       WHERE children_id = ANY($1)
         AND attendance_date BETWEEN $2 AND $3`,
      [childIds, startDate, endDate]
    );

    const attendanceMap = new Map<number, string[]>();
    for (const row of attendanceRes.rows) {
      if (!attendanceMap.has(row.children_id)) {
        attendanceMap.set(row.children_id, []);
      }
      attendanceMap.get(row.children_id)?.push(row.status);
    }

    let presentChildren = 0;
    let absentChildren = 0;

    for (const child of children) {
      const statuses = attendanceMap.get(child.child_id) || [];
      const isPresent = statuses.includes("present");
      if (isPresent) presentChildren++;
      else absentChildren++;
    }

    return {
      totalChildren,
      presentChildren,
      absentChildren,
    };
  }
}
