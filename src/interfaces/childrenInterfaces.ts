export interface IChild {
  id?: string;
  english_name: string;
  khmer_name: string;
  family_id?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  image_url?: string;
  registered_date?: string;
  description?: string;
  camp_id: string;
}

export interface IChildRepository {
  create(child: Omit<IChild, "id">): Promise<IChild>;
  findAll(): Promise<IChild[]>;
  findById(id: string): Promise<IChild | null>;
  findByCampId(campId: string): Promise<IChild[]>;
  update(id: string, child: Partial<Omit<IChild, "id">>): Promise<IChild>;
  delete(id: string): Promise<boolean>;
}


export interface IChildService {
  createChild(child: Omit<IChild, "id">): Promise<IChild>;
  getAllChildren(): Promise<IChild[]>;
  getChildById(id: string): Promise<IChild>;
  getChildrenByCampId(campId: string): Promise<IChild[]>;
  updateChild(id: string, child: Partial<Omit<IChild, "id">>): Promise<IChild>;
  deleteChild(id: string): Promise<void>;
}
