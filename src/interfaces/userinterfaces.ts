// src/interfaces/Userinterfaces.ts

export interface IUser {
  id?: string;
  role_id: number;
  khmer_name?: string;
  english_name?: string;
  age?: number;
  national?: string;
  position?: string;
  password?: string;
  email?: string;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface ILoginResponse {
  user: IUserWithoutPassword;
  token: string;
}

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}

export interface IUserService {
  getAllUsers(): Promise<IUserWithoutPassword[]>;
  getUserById(id: string): Promise<IUserWithoutPassword>;
  login(email: string, password: string): Promise<ILoginResponse>;
}
