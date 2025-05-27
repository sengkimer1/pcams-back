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
    async getEventById(id) {
        loggerService_1.logger.info("Fetching event by ID", { id });
        const event = await this.eventRepository.findById(id); // Now defined in IEventRepository
        if (!event) {
            throw new Error("Event not found");
        }
        loggerService_1.logger.info("Event fetched successfully", { id });
        return event;
    }
    async updateEvent(id, data) {
        loggerService_1.logger.info("Updating event", { id, data });
        const updatedEvent = await this.eventRepository.update(id, data); // Now defined in IEventRepository
        loggerService_1.logger.info("Event updated successfully", { id });
        return updatedEvent;
    }
    async deleteEvent(id) {
        loggerService_1.logger.info("Deleting event", { id });
        await this.eventRepository.delete(id); // Now defined in IEventRepository
        loggerService_1.logger.info("Event deleted successfully", { id });
    }
}
exports.EventService = EventService;
