export interface ICamp {
  id?: string;
  camp_event_id: string;
  camp_name: string;
  location?: string;
}

export interface ICampRepository {
  findAll(): Promise<ICamp[]>;
  findById(id: string): Promise<ICamp | null>;
  create(data: ICamp): Promise<ICamp>;
  update(id: string, data: ICamp): Promise<ICamp | null>;
  delete(id: string): Promise<boolean>;
  hasChildrenReferences(id: string): Promise<boolean>; // Added to check for children references
}

export interface ICampService {
  findAll(): Promise<ICamp[]>;
  findById(id: string): Promise<ICamp | null>;
  create(data: ICamp): Promise<ICamp>;
  update(id: string, data: ICamp): Promise<ICamp | null>;
  delete(id: string): Promise<boolean>;
}