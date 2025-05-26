export interface IEvent {
  id?: string;
  event_name: string;
  from_date: Date;
  end_date: Date;
  created_at?: Date;
}

export interface IEventRepository {
  create(event: Omit<IEvent, "id">): Promise<IEvent>;
  findAll(): Promise<IEvent[]>;
  findById(id: string): Promise<IEvent | null>;
  update(id: string, data: Partial<IEvent>): Promise<IEvent>;
  delete(id: string): Promise<void>;
}

export interface IEventService {
  createEvent(data: Omit<IEvent, "id">): Promise<IEvent>;
  getAllEvents(): Promise<IEvent[]>;
  getEventById(id: string): Promise<IEvent>;
  updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent>;
  deleteEvent(id: string): Promise<void>;
}