"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildAttendanceController = void 0;
class ChildAttendanceController {
    constructor(service) {
        this.service = service;
    }
    async createChildAttendance(req, res, next) {
        try {
            const { fullname, gender, age, family_id, attendance_date, status, camp_event_id } = req.body;
            const user_id = req.user?.id; // Extract user_id from token
            if (!user_id) {
                throw new Error("User ID not found in token");
            }
            const attendance = await this.service.createChildAttendance({
                fullname,
                gender,
                age,
                family_id,
                attendance_date,
                status,
                camp_event_id,
                user_id,
            });
            res.status(201).json({ data: attendance });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllChildAttendances(req, res, next) {
        try {
            const attendances = await this.service.getAllChildAttendances();
            res.status(200).json({ data: attendances });
        }
        catch (err) {
            next(err);
        }
    }
    async getChildAttendanceById(req, res, next) {
        try {
            const { id } = req.params;
            const attendance = await this.service.getChildAttendanceById(id);
            res.status(200).json({ data: attendance });
        }
        catch (err) {
            next(err);
        }
    }
    async updateChildAttendance(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const attendance = await this.service.updateChildAttendance(id, {
                status: status,
            });
            res.status(200).json({ data: attendance });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteChildAttendance(req, res, next) {
        try {
            const { id } = req.params;
            await this.service.deleteChildAttendance(id);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    }
    async getChildAttendanceByDateAndUser(req, res, next) {
        try {
            const { date, user_id } = req.query;
            const attendances = await this.service.getChildAttendanceByDateAndUser(date, user_id);
            res.status(200).json({ data: attendances });
        }
        catch (err) {
            next(err);
        }
    }
    async createChildAttendanceList(req, res, next) {
        try {
            const { attendance_date, organizer_id } = req.body;
            if (!organizer_id) {
                throw new Error("organizer_id is required");
            }
            const date = new Date(attendance_date);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid attendance_date format. Use YYYY-MM-DD");
            }
            const result = await this.service.createChildAttendanceList(organizer_id, date);
            res.status(201).json({ data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ChildAttendanceController = ChildAttendanceController;
