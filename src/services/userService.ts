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
      const users = await this.userRepository.findAll();
      return users.map(({ password, ...rest }) => rest);
    }
  
    async getUserById(id: string): Promise<IUserWithoutPassword> {
      const user = await this.userRepository.findById(id);
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
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
  
      const { password: _, ...userWithoutPassword } = user;
  
      return {
        user: userWithoutPassword,
        token,
      };
    }
  }
  