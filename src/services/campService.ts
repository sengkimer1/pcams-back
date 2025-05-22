import { ICamp, ICampRepository, ICampService } from "../interfaces/campInterfaces";
import { logger } from "./loggerService";

export class CampService implements ICampService {
  constructor(private campRepository: ICampRepository) {}

  async createCamp(data: Omit<ICamp, "id">): Promise<ICamp> {
    logger.info("Creating camp", { name: data.camp_name });
    const newCamp = await this.campRepository.create(data);
    logger.info("Camp created successfully", { id: newCamp.id });
    return newCamp;
  }

  async getAllCamps(): Promise<ICamp[]> {
    logger.info("Fetching all camps");
    return this.campRepository.findAll();
  }

  async getCampById(id: string): Promise<ICamp> {
    logger.info("Fetching camp by id", { id });
    const camp = await this.campRepository.findById(id);
    if (!camp) {
      throw Object.assign(new Error("Camp not found"), { status: 404 });
    }
    return camp;
  }
}