import { CampEventOrganizer, CampEventOrganizerRepository, CampEventOrganizerService as ICampEventOrganizerService } from "../interfaces/campEventOrganizerInterface";

export class CampEventOrganizerService implements ICampEventOrganizerService {
  constructor(private repository: CampEventOrganizerRepository) {}

  async createCampEventOrganizer(data: Omit<CampEventOrganizer, "id" | "created_at">): Promise<CampEventOrganizer> {
    if (!data.camp_event_id || !data.user_id) {
      throw new Error("camp_event_id and user_id are required");
    }
    return this.repository.create(data);
  }

  async getAllCampEventOrganizers(): Promise<CampEventOrganizer[]> {
    return this.repository.findAll();
  }

  async getCampEventOrganizerById(id: string): Promise<CampEventOrganizer> {
    const organizer = await this.repository.findById(id);
    if (!organizer) {
      throw new Error("Camp event organizer not found");
    }
    return organizer;
  }
    async updateCampEventOrganizer(id: string, data: Partial<Omit<CampEventOrganizer, "id" | "created_at">>): Promise<CampEventOrganizer> {
        if (data.camp_event_id === undefined && data.user_id === undefined) {
        throw new Error("At least one field (camp_event_id or user_id) must be provided for update");
        }
        return this.repository.update(id, data);
    }
    async deleteCampEventOrganizer(id: string): Promise<void> {
        const organizer = await this.repository.findById(id);
        if (!organizer) {
            throw new Error("Camp event organizer not found");
        }
        return this.repository.delete(id);
    }   
}