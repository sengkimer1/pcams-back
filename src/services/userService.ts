import { IUser, IUserWithoutPassword, IUserRepository, UserRole, ILoginResponse, IUserService } from "../interfaces/userinterfaces";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "./loggerService";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(data: { email: string; password: string; role: UserRole; username?: string; created_at?: Date }): Promise<{ user: IUserWithoutPassword; token: string }> {
    logger.info("Creating user", { email: data.email });
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw Object.assign(new Error("User already exists"), { status: 400 });
    }

    const userData: Omit<IUser, "id"> = {
      email: data.email,
      password: data.password,
      role: data.role,
      username: data.username,
      created_at: data.created_at || new Date(),
    };

    logger.info("User data prepared", { userData });
    const newUser = await this.userRepository.create(userData);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    logger.info("User created successfully", { id: newUser.id });
    return { user: newUser, token };
  }

  async getAllUsers(): Promise<IUserWithoutPassword[]> {
    logger.info("Fetching all users");
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUserWithoutPassword> {
    logger.info("Fetching user by id", { id });
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return user;
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    logger.info("Attempting login", { email });
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      throw Object.assign(new Error("Invalid password"), { status: 400 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });

    const { password: _, ...userWithoutPassword } = user;
    logger.info("Login successful", { id: user.id });
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async updateUser(id: string, updateData: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword> {
    logger.info("Updating user", { id });
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw Object.assign(new Error("Failed to update user"), { status: 500 });
    }
    logger.info("User updated successfully", { id });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    logger.info("Deleting user", { id });
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw Object.assign(new Error("Failed to delete user"), { status: 500 });
    }
    logger.info("User deleted successfully", { id });
  }

  async getOneUserByRole(role: UserRole): Promise<IUserWithoutPassword> {
    logger.info("Fetching user by role", { role });
    const user = await this.userRepository.getOneUserByRole(role);
    if (!user) {
      throw Object.assign(new Error("User with specified role not found"), { status: 404 });
    }
    return user;
  }
}