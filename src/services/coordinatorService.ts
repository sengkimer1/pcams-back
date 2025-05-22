import { CoordinatorAttendanceParams } from "../interfaces/coordinatorInterdace";
import { PostgresCoordinatorAttendanceRepository } from "../repositories/coordinatorRepository";

export class CoordinatorAttendanceService {
  constructor(private repository: PostgresCoordinatorAttendanceRepository) {}

  async getSummary(params: CoordinatorAttendanceParams) {
    return await this.repository.getCoordinatorAttendanceSummary(params);
  }
}
