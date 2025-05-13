import { ICampEvan, ICampEventRepository, ICampEventService } from "../interfaces/campEvenInterfaces";

export class CampEventService implements ICampEventService {
  static findById: any;
    static create: any;
  static findAll() {
      throw new Error("Method not implemented.");
  }
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
}
