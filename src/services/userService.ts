// src/services/UserService.ts
import {
  IUser,
  IUserService,
  IUserRepository,
  IUserWithoutPassword,
  ILoginResponse,
} from "../interfaces/userinterfaces";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<IUserWithoutPassword[]> {
    const users: IUser[] = await this.userRepository.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  async getUserById(id: string): Promise<IUserWithoutPassword> {
    const user: IUser | null = await this.userRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
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

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async createUser(
    requesterRoleId: number,
    userData: IUser
  ): Promise<IUserWithoutPassword> {
    if (requesterRoleId !== 1) {
      throw Object.assign(
        new Error("Forbidden: Only admins can create users"),
        { status: 403 }
      );
    }

    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw Object.assign(new Error("Email already in use"), { status: 400 });
    }

    const newUser: IUser = await this.userRepository.create(userData);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
