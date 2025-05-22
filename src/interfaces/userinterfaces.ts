export interface IUser {
  id?: string;
  email: string;
  password?: string;
  position: string;
  khmer_name: string;
  english_name: string;
  date_of_birth: string;
  nationality: string;
  camp_id?: string;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface ILoginResponse {
  user: IUserWithoutPassword;
  token: string;
}

export interface IUserRepository {
  create(user: Omit<IUser, "id">): Promise<IUserWithoutPassword>;
  findAll(): Promise<IUserWithoutPassword[]>;
  findById(id: string): Promise<IUserWithoutPassword | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword | null>;
  delete(id: string): Promise<boolean>;
  getOneUserByRole(roleName: string): Promise<IUserWithoutPassword | null>;
}

export interface IUserService {
  createUser(user: Omit<IUser, "id">): Promise<{ user: IUserWithoutPassword; token: string }>;
  getAllUsers(): Promise<IUserWithoutPassword[]>;
  getUserById(id: string): Promise<IUserWithoutPassword>;
  login(email: string, password: string): Promise<ILoginResponse>;
  updateUser(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword>;
  deleteUser(id: string): Promise<void>;
  getOneUserByRole(roleName: string): Promise<IUserWithoutPassword>;
}