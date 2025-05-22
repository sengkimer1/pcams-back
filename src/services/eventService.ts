import { IEvent, IEventRepository, IEventService } from "../interfaces/eventInterface";
import { logger } from "./loggerService";

export class EventService implements IEventService {
  constructor(private eventRepository: IEventRepository) {}

  async createEvent(data: Omit<IEvent, "id">): Promise<IEvent> {
    logger.info("Creating event", { name: data.event_name });
    const newEvent = await this.eventRepository.create(data);
    logger.info("Event created successfully", { id: newEvent.id });
    return newEvent;
  }

  async getAllEvents(): Promise<IEvent[]> {
    logger.info("Fetching all events");
    return this.eventRepository.findAll();
  }
}