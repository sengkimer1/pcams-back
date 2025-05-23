"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const loggerService_1 = require("./loggerService");
class EventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async createEvent(data) {
        loggerService_1.logger.info("Creating event", { name: data.event_name });
        const newEvent = await this.eventRepository.create(data);
        loggerService_1.logger.info("Event created successfully", { id: newEvent.id });
        return newEvent;
    }
    async getAllEvents() {
        loggerService_1.logger.info("Fetching all events");
        return this.eventRepository.findAll();
    }
}
exports.EventService = EventService;
