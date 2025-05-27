"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const loggerService_1 = require("../services/loggerService");
class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async createEvent(req, res, next) {
        try {
            const { event_name, from_date, end_date, created_at } = req.body;
            if (!event_name || !from_date || !end_date) {
                throw Object.assign(new Error("event_name, from_date, and end_date are required"), { status: 400 });
            }
            const fromDate = new Date(from_date);
            const endDate = new Date(end_date);
            const createdAt = created_at ? new Date(created_at) : new Date();
            if (isNaN(fromDate.getTime()) || isNaN(endDate.getTime()) || (created_at && isNaN(createdAt.getTime()))) {
                throw Object.assign(new Error("Invalid date format"), { status: 400 });
            }
            if (fromDate >= endDate) {
                throw Object.assign(new Error("from_date must be before end_date"), { status: 400 });
            }
            const newEvent = await this.eventService.createEvent({
                event_name,
                from_date: fromDate,
                end_date: endDate,
                created_at: createdAt,
            });
            loggerService_1.logger.info("Event created", { id: newEvent.id });
            res.status(201).json({ message: "Event created successfully", data: newEvent });
        }
        catch (err) {
            loggerService_1.logger.error("Error in createEvent", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async getAllEvents(req, res, next) {
        try {
            const events = await this.eventService.getAllEvents();
            loggerService_1.logger.info("Fetched all events");
            res.status(200).json(events);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getAllEvents", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async getEventById(req, res, next) {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(id);
            res.status(200).json(event);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getEventById", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async updateEvent(req, res, next) {
        try {
            const { id } = req.params;
            const { event_name, from_date, end_date } = req.body;
            const updateData = {};
            if (event_name)
                updateData.event_name = event_name;
            if (from_date) {
                const fromDate = new Date(from_date);
                if (isNaN(fromDate.getTime())) {
                    throw Object.assign(new Error("Invalid from_date format"), { status: 400 });
                }
                updateData.from_date = fromDate;
            }
            if (end_date) {
                const endDate = new Date(end_date);
                if (isNaN(endDate.getTime())) {
                    throw Object.assign(new Error("Invalid end_date format"), { status: 400 });
                }
                updateData.end_date = endDate;
            }
            if (updateData.from_date && updateData.end_date && updateData.from_date >= updateData.end_date) {
                throw Object.assign(new Error("from_date must be before end_date"), { status: 400 });
            }
            const updatedEvent = await this.eventService.updateEvent(id, updateData);
            res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
        }
        catch (err) {
            loggerService_1.logger.error("Error in updateEvent", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async deleteEvent(req, res, next) {
        try {
            const { id } = req.params;
            await this.eventService.deleteEvent(id);
            res.status(204).send();
        }
        catch (err) {
            loggerService_1.logger.error("Error in deleteEvent", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
}
exports.EventController = EventController;
