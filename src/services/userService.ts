import { IUserService, IUser, IUserWithoutPassword, IUserRepository } from "../interfaces/userinterfaces";
import { CampUserService } from "../interfaces/campUserInterface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private campUserService: CampUserService
  ) {}

  async createUser(user: Omit<IUser, "id">): Promise<{ user: IUserWithoutPassword; token: string }> {
    console.log("Received user data:", user);
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw Object.assign(new Error("User already exists"), { status: 400 });
    }

    if (!user.camp_id) {
      console.error("camp_id is missing or null in the request");
      throw Object.assign(new Error("Camp ID is required"), { status: 400 });
    }

    if (!user.position) {
      console.error("position is missing in the request");
      throw Object.assign(new Error("Position is required"), { status: 400 });
    }

    console.log("Creating user with camp_id:", user.camp_id);
    const newUser = await this.userRepository.create(user);

    try {
      console.log("Creating CampUser entry for user_id:", newUser.id, "with camp_id:", user.camp_id);
      await this.campUserService.create({
        camp_id: user.camp_id,
        user_id: newUser.id!,
        is_active: true,
      });
      console.log("CampUser entry created successfully");
    } catch (error) {
      console.error("Failed to create CampUser entry:", error);
      throw Object.assign(new Error("Failed to associate user with camp"), { status: 500 });
    }

    const token = jwt.sign({ id: newUser.id, position: newUser.position }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { user: newUser, token };
  }

  async getAllUsers(): Promise<IUserWithoutPassword[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUserWithoutPassword> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return user;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      throw Object.assign(new Error("Invalid password"), { status: 400 });
    }

    const token = jwt.sign({ id: user.id, position: user.position }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async updateUser(
    id: string,
    user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>
  ): Promise<IUserWithoutPassword> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const updatedUser = await this.userRepository.update(id, user);
    if (!updatedUser) {
      throw Object.assign(new Error("Failed to update user"), { status: 500 });
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw Object.assign(new Error("Failed to delete user"), { status: 500 });
    }
  }

  async getOneUserByRole(roleName: string): Promise<IUserWithoutPassword> {
    const user = await this.userRepository.getOneUserByRole(roleName);
    if (!user) {
      throw Object.assign(new Error("User with specified role not found"), { status: 404 });
    }
    return user;
  }
}