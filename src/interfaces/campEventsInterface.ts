export interface ICampEvan {
  id?: string;
  camp_event_name?: string;
}

export interface ICampEventRepository {
  delete(id: string): boolean | PromiseLike<boolean>;
  update(id: string, data: ICampEvan): ICampEvan | PromiseLike<ICampEvan | null> | null;
  findAll(): Promise<ICampEvan[]>;
  findById(id: string): Promise<ICampEvan | null>;
  create(data: ICampEvan): Promise<ICampEvan>;
}

export interface ICampEventService {
  findAll(): Promise<ICampEvan[]>;
  findById(id: string): Promise<ICampEvan | null>;
  create(data: ICampEvan): Promise<ICampEvan>;
}