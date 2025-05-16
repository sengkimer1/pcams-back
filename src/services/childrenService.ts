import { IChild, IChildRepository, IChildService } from "../interfaces/childrenInterfaces";

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

  async updateChild(id: string, child: Partial<Omit<IChild, "id">>): Promise<IChild> {
    const existingChild = await this.childRepository.findById(id);
    if (!existingChild) {
      throw Object.assign(new Error("Child not found"), { status: 404 });
    }
  
    return await this.childRepository.update(id, child);
  }
  
  async deleteChild(id: string): Promise<void> {
    const existingChild = await this.childRepository.findById(id);
    if (!existingChild) {
      throw Object.assign(new Error("Child not found"), { status: 404 });
    }

    await this.childRepository.delete(id);
  }
}
