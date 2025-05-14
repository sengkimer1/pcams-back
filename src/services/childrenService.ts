import { IChild, IChildRepository,IChildService } from "../interfaces/childrenInterfaces";

export class ChildService implements IChildService {
  constructor(private childRepository: IChildRepository) {}

  async createChild(child: Omit<IChild, "id">): Promise<IChild> {
    return await this.childRepository.create(child);
  }

  async getAllChildren(): Promise<IChild[]> {
    return await this.childRepository.findAll();
  }

  async getChildById(id: string): Promise<IChild> {
    const child = await this.childRepository.findById(id);
    if (!child) {
      throw Object.assign(new Error("Child not found"), { status: 404 });
    }
    return child;
  }

  async getChildrenByCampId(campId: string): Promise<IChild[]> {
    return await this.childRepository.findByCampId(campId);
  }
}
