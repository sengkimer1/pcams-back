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
}