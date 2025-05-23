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
            // Validate date fields
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
}
exports.EventController = EventController;
