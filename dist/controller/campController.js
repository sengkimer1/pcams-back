"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampController = void 0;
const loggerService_1 = require("../services/loggerService");
class CampController {
    constructor(campService) {
        this.campService = campService;
    }
    async createCamp(req, res, next) {
        try {
            const { camp_name, camp_location, created_at } = req.body;
            if (!camp_name || !camp_location) {
                throw Object.assign(new Error("camp_name and camp_location are required"), { status: 400 });
            }
            // Validate created_at if provided
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
            const newCamp = await this.campService.createCamp({
                camp_name,
                camp_location,
                created_at: createdAt,
            });
            loggerService_1.logger.info("Camp created", { id: newCamp.id });
            res.status(201).json({ message: "Camp created successfully", data: newCamp });
        }
        catch (err) {
            loggerService_1.logger.error("Error in createCamp", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async getAllCamps(req, res, next) {
        try {
            const camps = await this.campService.getAllCamps();
            loggerService_1.logger.info("Fetched all camps");
            res.status(200).json(camps);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getAllCamps", { error: err instanceof Error ? err.message : String(err) });
            next(err);
        }
    }
    async getCampById(req, res, next) {
        try {
            const { id } = req.params;
            const camp = await this.campService.getCampById(id);
            loggerService_1.logger.info("Fetched camp by id", { id });
            res.status(200).json(camp);
        }
        catch (err) {
            loggerService_1.logger.error("Error in getCampById", { error: err instanceof Error ? err.message : String(err), id: req.params.id });
            next(err);
        }
    }
}
exports.CampController = CampController;
