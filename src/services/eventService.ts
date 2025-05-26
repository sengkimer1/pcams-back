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

  async getEventById(id: string): Promise<IEvent> {
    logger.info("Fetching event by ID", { id });
    const event = await this.eventRepository.findById(id); // Now defined in IEventRepository
    if (!event) {
      throw new Error("Event not found");
    }
    logger.info("Event fetched successfully", { id });
    return event;
  }

  async updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent> {
    logger.info("Updating event", { id, data });
    const updatedEvent = await this.eventRepository.update(id, data); // Now defined in IEventRepository
    logger.info("Event updated successfully", { id });
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    logger.info("Deleting event", { id });
    await this.eventRepository.delete(id); // Now defined in IEventRepository
    logger.info("Event deleted successfully", { id });
  }
}