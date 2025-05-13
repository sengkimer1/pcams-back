import { ICampEvan, ICampEventRepository, ICampEventService } from "../interfaces/campEventsInterface";

export class CampEventService implements ICampEventService {
  constructor(private campEventRepository: ICampEventRepository) {}

  async findAll(): Promise<ICampEvan[]> {
    return this.campEventRepository.findAll();
  }

  async findById(id: string): Promise<ICampEvan | null> {
    return this.campEventRepository.findById(id);
  }

  async create(data: ICampEvan): Promise<ICampEvan> {
    return this.campEventRepository.create(data);
  }

//   async update(id: string, data: ICampEvan): Promise<ICampEvan | null> {
//     return this.campEventRepository.update(id, data);
//   }

//   async delete(id: string): Promise<boolean> {
//     return this.campEventRepository.delete(id);
//   }
}
