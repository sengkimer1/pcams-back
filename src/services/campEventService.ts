import { ICampEvent, ICampEventRepository, ICampEventService } from "../interfaces/campEventInterface";
import { logger } from "./loggerService";

export class CampEventService implements ICampEventService {
  constructor(private campEventRepository: ICampEventRepository) {}

  async createCampEvent(data: Omit<ICampEvent, "id">): Promise<ICampEvent> {
    logger.info("Creating camp-event association", { camp_id: data.camp_id, event_id: data.event_id });
    const newCampEvent = await this.campEventRepository.create(data);
    logger.info("Camp-event association created successfully", { id: (newCampEvent as ICampEvent).id, camp_id: newCampEvent.camp_id, event_id: newCampEvent.event_id });
    return newCampEvent;
  }

  async getAllCampEvents(): Promise<ICampEvent[]> {
    logger.info("Fetching all camp-event associations");
    return this.campEventRepository.findAll();
  }

  async getCampEventById(id: string): Promise<ICampEvent | null> {
    logger.info("Fetching camp-event by ID", { id });
    const campEvent = await this.campEventRepository.findById(id);
    if (!campEvent) {
      logger.warn("Camp-event not found", { id });
    }
    return campEvent;
  }

  async updateCampEvent(id: string, data: Partial<Omit<ICampEvent, "id">>): Promise<ICampEvent> {
    logger.info("Updating camp-event", { id, ...data });
    const updatedCampEvent = await this.campEventRepository.update(id, data);
    logger.info("Camp-event updated successfully", { id: updatedCampEvent.id, camp_id: updatedCampEvent.camp_id, event_id: updatedCampEvent.event_id });
    return updatedCampEvent;
  }

  async deleteCampEvent(id: string): Promise<boolean> {
    logger.info("Deleting camp-event", { id });
    const deleted = await this.campEventRepository.delete(id);
    if (deleted) {
      logger.info("Camp-event deleted successfully", { id });
    } else {
      logger.warn("Camp-event not found for deletion", { id });
    }
    return deleted;
  }
}