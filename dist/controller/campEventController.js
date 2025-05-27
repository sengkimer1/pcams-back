"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampEventController = void 0;
const loggerService_1 = require("../services/loggerService");
class CampEventController {
    constructor(campEventService) {
        this.campEventService = campEventService;
    }
    async createCampEvent(req, res, next) {
        try {
            const { camp_id, event_id, created_at } = req.body;
            if (!camp_id || !event_id) {
                throw Object.assign(new Error("camp_id and event_id are required"), { status: 400 });
            }
            let createdAt;
            if (created_at) {
                createdAt = new Date(created_at);
                if (isNaN(createdAt.getTime())) {
                    throw Object.assign(new Error("Invalid date format for created_at"), { status: 400 });
                }
            }
            else {
                createdAt = new Date();
            }
            const newCampEvent = await this.campEventService.createCampEvent({
                camp_id,
                event_id,
                created_at: createdAt,
            });
            loggerService_1.logger.info("Camp-event created", { id: newCampEvent.id, camp_id: newCampEvent.camp_id, event_id: newCampEvent.event_id });
            res.status(201).json({ message: "Camp-event association created successfully", data: newCampEvent });
        }
        catch (err) {
            loggerService_1.logger.error("Error in createCampEvent", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async getAllCampEvents(req, res, next) {
        try {
            const campEvents = await this.campEventService.getAllCampEvents();
            loggerService_1.logger.info("Fetched all camp-event associations");
            res.status(200).json(campEvents);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getAllCampEvents", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async getCampEventById(req, res, next) {
        const eventId = req.params.id;
        try {
            const event = await this.campEventService.getCampEventById(eventId);
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json(event);
        }
        catch (error) {
            next(error);
        }
    }
    async updateCampEvent(req, res, next) {
        try {
            const { id } = req.params;
            const { camp_id, event_id, created_at } = req.body;
            if (!id) {
                throw Object.assign(new Error("id is required"), { status: 400 });
            }
            let updatedData = {};
            if (camp_id !== undefined)
                updatedData.camp_id = camp_id;
            if (event_id !== undefined)
                updatedData.event_id = event_id;
            if (created_at !== undefined) {
                const createdAt = new Date(created_at);
                if (isNaN(createdAt.getTime())) {
                    throw Object.assign(new Error("Invalid date format for created_at"), { status: 400 });
                }
                updatedData.created_at = createdAt;
            }
            if (Object.keys(updatedData).length === 0) {
                throw Object.assign(new Error("No updates provided"), { status: 400 });
            }
            const updatedCampEvent = await this.campEventService.updateCampEvent(id, updatedData);
            loggerService_1.logger.info("Camp-event updated", { id: updatedCampEvent.id, camp_id: updatedCampEvent.camp_id, event_id: updatedCampEvent.event_id });
            res.status(200).json({ message: "Camp-event updated successfully", data: updatedCampEvent });
        }
        catch (err) {
            loggerService_1.logger.error("Error in updateCampEvent", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async deleteCampEvent(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw Object.assign(new Error("id is required"), { status: 400 });
            }
            const deleted = await this.campEventService.deleteCampEvent(id);
            if (deleted) {
                loggerService_1.logger.info("Camp-event deleted", { id });
                res.status(200).json({ message: "Camp-event deleted successfully" });
            }
            else {
                res.status(404).json({ message: "Camp-event not found" });
            }
        }
        catch (err) {
            loggerService_1.logger.error("Error in deleteCampEvent", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
}
exports.CampEventController = CampEventController;
