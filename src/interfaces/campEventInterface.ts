export interface ICampEvent {
  id?: string;
  camp_id: string;
  event_id: string;
  created_at?: Date;
}

export interface ICampEventRepository {
  create(campEvent: Omit<ICampEvent, "id">): Promise<ICampEvent>;
  findAll(): Promise<ICampEvent[]>;
  findById(id: string): Promise<ICampEvent | null>; // Added
  update(id: string, campEvent: Partial<Omit<ICampEvent, "id">>): Promise<ICampEvent>; // Added
  delete(id: string): Promise<boolean>; // Added
}

export interface ICampEventService {
  createCampEvent(data: Omit<ICampEvent, "id">): Promise<ICampEvent>;
  getAllCampEvents(): Promise<ICampEvent[]>;
  getCampEventById(id: string): Promise<ICampEvent | null>; // Added
  updateCampEvent(id: string, data: Partial<Omit<ICampEvent, "id">>): Promise<ICampEvent>; // Added
  deleteCampEvent(id: string): Promise<boolean>; // Added
}