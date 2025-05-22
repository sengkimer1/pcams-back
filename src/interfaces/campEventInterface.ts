export interface ICampEvent {
    id?: string;
    camp_id: string;
    event_id: string;
    created_at?: Date;
  }
  
  export interface ICampEventRepository {
    create(campEvent: Omit<ICampEvent, "id">): Promise<ICampEvent>;
    findAll(): Promise<ICampEvent[]>;
  }
  
  export interface ICampEventService {
    createCampEvent(data: Omit<ICampEvent, "id">): Promise<ICampEvent>;
    getAllCampEvents(): Promise<ICampEvent[]>;
  }