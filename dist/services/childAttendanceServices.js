"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildAttendanceService = void 0;
class ChildAttendanceService {
    constructor(repository) {
        this.repository = repository;
    }
    async createChildAttendance(data) {
        if (!data.fullname || !data.gender || !data.age || !data.family_id || !data.attendance_date || !data.status || !data.camp_event_id || !data.user_id) {
            throw new Error("All fields are required");
        }
        if (!["Present", "Absent"].includes(data.status)) {
            throw new Error("Status must be 'Present' or 'Absent'");
        }
        return this.repository.create(data);
    }
    async getAllChildAttendances() {
        return this.repository.findAll();
    }
    async getChildAttendanceById(id) {
        const attendance = await this.repository.findById(id);
        if (!attendance) {
            throw new Error("Child attendance record not found");
        }
        return attendance;
    }
    async updateChildAttendance(id, data) {
        if (data.status && !["Present", "Absent"].includes(data.status)) {
            throw new Error("Status must be 'Present' or 'Absent'");
        }
        return this.repository.update(id, data);
    }
    async deleteChildAttendance(id) {
        return this.repository.delete(id);
    }
    async getChildAttendanceByDateAndUser(attendance_date, user_id) {
        let parsedDate = null;
        if (attendance_date) {
            parsedDate = new Date(attendance_date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date format. Please use YYYY-MM-DD");
            }
        }
        const attendances = await this.repository.findByDateAndUserId(parsedDate, user_id);
        return attendances;
    }
    async createChildAttendanceList(organizer_id, attendance_date) {
        if (!organizer_id || !attendance_date) {
            throw new Error("organizer_id and attendance_date are required");
        }
        return this.repository.createChildAttendanceList(organizer_id, attendance_date);
    }
}
exports.ChildAttendanceService = ChildAttendanceService;
