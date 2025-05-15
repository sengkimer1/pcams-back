import { ICamp, ICampRepository, ICampService } from "../interfaces/campsInterface";

export class CampService implements ICampService {
  campEventRepository: any;
  constructor(private repository: ICampRepository) {}

  async findAll(): Promise<ICamp[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<ICamp | null> {
    return this.repository.findById(id);
  }

  async create(data: ICamp): Promise<ICamp> {
    return this.repository.create(data);
  }

  async update(id: string, data: ICamp): Promise<ICamp | null> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.campEventRepository.delete(id);
  }
}