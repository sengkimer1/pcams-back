"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
class DashboardService {
    constructor(coordinatorRepo) {
        this.coordinatorRepo = coordinatorRepo;
    }
    async getAttendanceSummary(date) {
        return this.coordinatorRepo.getByDateRange(date);
    }
    async getAdminCampSummary(startDate, endDate) {
        return this.coordinatorRepo.getAdminCampSummary(startDate, endDate);
    }
}
exports.DashboardService = DashboardService;
