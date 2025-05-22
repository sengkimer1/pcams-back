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
  }
  
  export interface CampEventOrganizerService {
    createCampEventOrganizer(data: Omit<CampEventOrganizer, "id" | "created_at">): Promise<CampEventOrganizer>;
    getAllCampEventOrganizers(): Promise<CampEventOrganizer[]>;
    getCampEventOrganizerById(id: string): Promise<CampEventOrganizer>;
  }