export enum UserRole {
  ADMIN = "admin",
  COORDINATOR = "coordinator",
  MONITOR = "monitor",
}

export interface IUser {
  id?: string;
  username?: string;
  email: string;
  password?: string;
  role: UserRole;
  nationality?: string; // New field, optional
  created_at?: Date;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface ILoginResponse {
  user: IUserWithoutPassword;
  token: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUserRepository {
  findAll(): Promise<IUserWithoutPassword[]>;
  findById(id: string): Promise<IUserWithoutPassword | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Omit<IUser, "id">): Promise<IUserWithoutPassword>;
  update(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword | null>;
  delete(id: string): Promise<boolean>;
  getOneUserByRole(roleName: UserRole): Promise<IUserWithoutPassword | null>;
  getUserbycamp(camp_event_id: string): Promise<IUserWithoutPassword[]>;
}

export interface IUserService {
  login(email: string, password: string): Promise<ILoginResponse>;
  createUser(data: { email: string; password: string; role: UserRole; username?: string; nationality?: string; created_at?: Date }): Promise<{ user: IUserWithoutPassword; token: string }>;
  getAllUsers(): Promise<IUserWithoutPassword[]>;
  getUserById(id: string): Promise<IUserWithoutPassword>;
  updateUser(id: string, updateData: Partial<Omit<IUser, "id" | "password"> & { password?: string; nationality?: string }>): Promise<IUserWithoutPassword>;
  deleteUser(id: string): Promise<void>;
  getOneUserByRole(role: UserRole): Promise<IUserWithoutPassword>;
  getUserbycamp(camp_event_id: string): Promise<IUserWithoutPassword[]>;
}