import { CampUser, CampUserRepository, CampUserService } from "../interfaces/campUserInterface";

export class PostgresCampUserService implements CampUserService {
  constructor(private repository: CampUserRepository) {}

  async create(data: CampUser): Promise<CampUser> {
    return this.repository.create(data);
  }

  async findAll(): Promise<CampUser[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<CampUser | null> {
    return this.repository.findById(id);
  }
}