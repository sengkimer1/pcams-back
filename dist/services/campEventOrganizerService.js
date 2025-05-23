"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampEventOrganizerService = void 0;
class CampEventOrganizerService {
    constructor(repository) {
        this.repository = repository;
    }
    async createCampEventOrganizer(data) {
        if (!data.camp_event_id || !data.user_id) {
            throw new Error("camp_event_id and user_id are required");
        }
        return this.repository.create(data);
    }
    async getAllCampEventOrganizers() {
        return this.repository.findAll();
    }
    async getCampEventOrganizerById(id) {
        const organizer = await this.repository.findById(id);
        if (!organizer) {
            throw new Error("Camp event organizer not found");
        }
        return organizer;
    }
}
exports.CampEventOrganizerService = CampEventOrganizerService;
