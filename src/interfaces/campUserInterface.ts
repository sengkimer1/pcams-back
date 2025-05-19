export interface CampUser {
  id?: string;
  camp_id: string;
  user_id: string;
  is_active: boolean;
}

export interface CampUserRepository {
  create(data: CampUser): Promise<CampUser>;
  findAll(): Promise<CampUser[]>;
  findById(id: string): Promise<CampUser | null>;
}

export interface CampUserService {
  create(data: CampUser): Promise<CampUser>;
  findAll(): Promise<CampUser[]>;
  findById(id: string): Promise<CampUser | null>;
}