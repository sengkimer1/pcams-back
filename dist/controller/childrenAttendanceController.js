"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildAttendanceController = void 0;
class ChildAttendanceController {
    constructor(service) {
        this.service = service;
    }
    async createChildAttendance(req, res, next) {
        try {
            const { fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id } = req.body;
            const attendance = await this.service.createChildAttendance({ fullname, gender, age, family_id, attendance_date, status, camp_event_id, user_id });
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
            const { id, state } = req.params;
            const attendance = await this.service.updateChildAttendance(id, { status: state });
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
    async getChildAttendanceByDate(req, res, next) {
        try {
            const { date } = req.params;
            const attendances = await this.service.getChildAttendanceByDate(date);
            res.status(200).json({ data: attendances });
        }
        catch (err) {
            next(err);
        }
    }
    async getChildAttendanceByUser(req, res, next) {
        try {
            const { user_id } = req.params;
            const attendances = await this.service.getChildAttendanceByUser(user_id);
            res.status(200).json({ data: attendances });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ChildAttendanceController = ChildAttendanceController;
