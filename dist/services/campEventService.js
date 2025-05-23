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
}
exports.CampEventService = CampEventService;
