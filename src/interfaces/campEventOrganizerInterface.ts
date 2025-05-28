export interface CampEventOrganizer {
  id?: string;
  camp_event_id: string;
  user_id: string;
  created_at?: Date;
}

export interface CampEventOrganizerRepository {
  create(data: Omit<CampEventOrganizer, "id" | "created_at">): Promise<CampEventOrganizer>;
  findAll(): Promise<CampEventOrganizer[]>;
  findById(id: string): Promise<CampEventOrganizer | null>;
  update(id: string, data: Partial<Omit<CampEventOrganizer, "id" | "created_at">>): Promise<CampEventOrganizer>;
  delete(id: string): Promise<void>;
  findCampEventsByUserId(userId: string): Promise<any[]>; // Returns camp events with camp and event details
}

export interface CampEventOrganizerService {
  createCampEventOrganizer(data: Omit<CampEventOrganizer, "id" | "created_at">): Promise<CampEventOrganizer>;
  getAllCampEventOrganizers(): Promise<CampEventOrganizer[]>;
  getCampEventOrganizerById(id: string): Promise<CampEventOrganizer>;
  updateCampEventOrganizer(id: string, data: Partial<Omit<CampEventOrganizer, "id" | "created_at">>): Promise<CampEventOrganizer>;
  deleteCampEventOrganizer(id: string): Promise<void>;
  getCampEventsByUserId(userId: string): Promise<any[]>; // Returns camp events with camp and event details
}