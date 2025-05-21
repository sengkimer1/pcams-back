import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  IUser,
  IUserService,
  IUserWithoutPassword,
  IUserRepository,
  ILoginResponse,
} from "../interfaces/userinterfaces";
import { CampUser } from "../interfaces/campUserInterface";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(user: Omit<IUser, "id">): Promise<{ user: IUserWithoutPassword; token: string }> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw Object.assign(new Error("User already exists"), { status: 400 });
    }
    const newUser = await this.userRepository.create(user);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
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

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    const isValidPassword = await bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      throw Object.assign(new Error("Invalid password"), { status: 400 });
    }
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
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

  async createUserCamp(
    user: Omit<IUser, "id"> & { camp_id: string }
  ): Promise<{ user: IUserWithoutPassword; campUser: CampUser; token: string }> {
    if (!user.camp_id) {
      throw Object.assign(new Error("Camp ID is required"), { status: 400 });
    }
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw Object.assign(new Error("User already exists"), { status: 400 });
    }
    const { user: newUser, campUser } = await this.userRepository.createUserCamp(user);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return { user: newUser, campUser, token };
  }

  async getAllUserCamps(): Promise<(IUserWithoutPassword & { camp_id: string })[]> {
    return this.userRepository.findAllUserCamps();
  }

  async getUserCampById(id: string): Promise<IUserWithoutPassword & { camp_id: string }> {
    const userCamp = await this.userRepository.findUserCampById(id);
    if (!userCamp) {
      throw Object.assign(new Error("User with camp not found"), { status: 404 });
    }
    return userCamp;
  }
}