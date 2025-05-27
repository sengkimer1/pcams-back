"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampEventOrganizerController = void 0;
class CampEventOrganizerController {
    constructor(service) {
        this.service = service;
    }
    async createCampEventOrganizer(req, res, next) {
        try {
            const { camp_event_id, user_id } = req.body;
            if (!camp_event_id || !user_id) {
                throw new Error("camp_event_id and user_id are required");
            }
            const organizer = await this.service.createCampEventOrganizer({ camp_event_id, user_id });
            res.status(201).json({ message: "Camp event organizer created", data: organizer });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllCampEventOrganizers(req, res, next) {
        try {
            const organizers = await this.service.getAllCampEventOrganizers();
            res.status(200).json(organizers);
        }
        catch (err) {
            next(err);
        }
    }
    async getCampEventOrganizerById(req, res, next) {
        try {
            const { id } = req.params;
            const organizer = await this.service.getCampEventOrganizerById(id);
            res.status(200).json(organizer);
        }
        catch (err) {
            next(err);
        }
    }
    async updateCampEventOrganizer(req, res, next) {
        try {
            const { id } = req.params;
            const { camp_event_id, user_id } = req.body;
            const organizer = await this.service.updateCampEventOrganizer(id, { camp_event_id, user_id });
            res.status(200).json({ message: "Camp event organizer updated", data: organizer });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteCampEventOrganizer(req, res, next) {
        try {
            const { id } = req.params;
            await this.service.deleteCampEventOrganizer(id);
            res.status(200).json({ message: "Camp event organizer deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CampEventOrganizerController = CampEventOrganizerController;
