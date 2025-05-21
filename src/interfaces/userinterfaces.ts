import { CampUser } from "./campUserInterface";

export interface IUser {
  id?: string;
  email: string;
  password?: string;
  role_id: number;
  khmer_name: string;
  english_name: string;
  date_of_birth: string;
  nationality: string;
  position: string;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface ILoginResponse {
  user: IUserWithoutPassword;
  token: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findAll(): Promise<IUserWithoutPassword[]>;
  findById(id: string): Promise<IUserWithoutPassword | null>;
  update(id: string, user: Partial<IUser>): Promise<IUserWithoutPassword | null>;
  delete(id: string): Promise<boolean>;
  getOneUserByRole(roleName: string): Promise<IUserWithoutPassword | null>;
  create(user: Omit<IUser, "id">): Promise<IUserWithoutPassword>;
  createCampUser(campUser: { user_id: string; camp_id: string }): Promise<CampUser>;
  createUserCamp(
    user: Omit<IUser, "id"> & { camp_id: string },
    client?: any
  ): Promise<{ user: IUserWithoutPassword; campUser: CampUser }>;
  findAllUserCamps(): Promise<(IUserWithoutPassword & { camp_id: string })[]>;
  findUserCampById(id: string): Promise<IUserWithoutPassword & { camp_id: string } | null>;
}

export interface IUserService {
  createUser(user: Omit<IUser, "id">): Promise<{ user: IUserWithoutPassword; token: string }>;
  getAllUsers(): Promise<IUserWithoutPassword[]>;
  getUserById(id: string): Promise<IUserWithoutPassword>;
  login(email: string, password: string): Promise<ILoginResponse>;
  updateUser(
    id: string,
    user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>
  ): Promise<IUserWithoutPassword>;
  deleteUser(id: string): Promise<void>;
  getOneUserByRole(roleName: string): Promise<IUserWithoutPassword>;
  createUserCamp(
    user: Omit<IUser, "id"> & { camp_id: string }
  ): Promise<{ user: IUserWithoutPassword; campUser: CampUser; token: string }>;
  getAllUserCamps(): Promise<(IUserWithoutPassword & { camp_id: string })[]>;
  getUserCampById(id: string): Promise<IUserWithoutPassword & { camp_id: string }>;
}