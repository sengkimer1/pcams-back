"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampService = void 0;
const loggerService_1 = require("./loggerService");
class CampService {
    constructor(campRepository) {
        this.campRepository = campRepository;
    }
    async createCamp(data) {
        loggerService_1.logger.info("Creating camp", { name: data.camp_name });
        const newCamp = await this.campRepository.create(data);
        loggerService_1.logger.info("Camp created successfully", { id: newCamp.id });
        return newCamp;
    }
    async getAllCamps() {
        loggerService_1.logger.info("Fetching all camps");
        return this.campRepository.findAll();
    }
    async getCampById(id) {
        loggerService_1.logger.info("Fetching camp by id", { id });
        const camp = await this.campRepository.findById(id);
        if (!camp) {
            throw Object.assign(new Error("Camp not found"), { status: 404 });
        }
        return camp;
    }
}
exports.CampService = CampService;
