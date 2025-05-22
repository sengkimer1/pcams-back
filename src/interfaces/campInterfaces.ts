export interface ICamp {
    id?: string;
    camp_name: string;
    camp_location: string;
    created_at?: Date;
  }
  
  export interface ICampRepository {
    create(camp: Omit<ICamp, "id">): Promise<ICamp>;
    findAll(): Promise<ICamp[]>;
    findById(id: string): Promise<ICamp | null>;
  }
  
  export interface ICampService {
    createCamp(data: Omit<ICamp, "id">): Promise<ICamp>;
    getAllCamps(): Promise<ICamp[]>;
    getCampById(id: string): Promise<ICamp>;
  }