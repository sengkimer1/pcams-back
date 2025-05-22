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
  }
  
  export interface IEventService {
    createEvent(data: Omit<IEvent, "id">): Promise<IEvent>;
    getAllEvents(): Promise<IEvent[]>;
  }