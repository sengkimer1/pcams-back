"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampEventService = void 0;
const loggerService_1 = require("./loggerService");
class CampEventService {
    constructor(campEventRepository) {
        this.campEventRepository = campEventRepository;
    }
    async createCampEvent(data) {
        loggerService_1.logger.info("Creating camp-event association", { camp_id: data.camp_id, event_id: data.event_id });
        const newCampEvent = await this.campEventRepository.create(data);
        loggerService_1.logger.info("Camp-event association created successfully", { id: newCampEvent.id, camp_id: newCampEvent.camp_id, event_id: newCampEvent.event_id });
        return newCampEvent;
    }
    async getAllCampEvents() {
        loggerService_1.logger.info("Fetching all camp-event associations");
        return this.campEventRepository.findAll();
    }
    async getCampEventById(id) {
        loggerService_1.logger.info("Fetching camp-event by ID", { id });
        const campEvent = await this.campEventRepository.findById(id);
        if (!campEvent) {
            loggerService_1.logger.warn("Camp-event not found", { id });
        }
        return campEvent;
    }
    async updateCampEvent(id, data) {
        loggerService_1.logger.info("Updating camp-event", { id, ...data });
        const updatedCampEvent = await this.campEventRepository.update(id, data);
        loggerService_1.logger.info("Camp-event updated successfully", { id: updatedCampEvent.id, camp_id: updatedCampEvent.camp_id, event_id: updatedCampEvent.event_id });
        return updatedCampEvent;
    }
    async deleteCampEvent(id) {
        loggerService_1.logger.info("Deleting camp-event", { id });
        const deleted = await this.campEventRepository.delete(id);
        if (deleted) {
            loggerService_1.logger.info("Camp-event deleted successfully", { id });
        }
        else {
            loggerService_1.logger.warn("Camp-event not found for deletion", { id });
        }
        return deleted;
    }
}
exports.CampEventService = CampEventService;
