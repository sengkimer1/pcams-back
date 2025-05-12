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
  create(userData: IUser): Promise<IUserWithoutPassword>;
  findAll(): Promise<IUserWithoutPassword[]>;
  findById(id: string): Promise<IUserWithoutPassword | null>;
  findByEmail(email: string): Promise<IUser | null>;
}

export interface IUserService {
  createUser(requesterRoleId: number, userData: IUser): Promise<IUserWithoutPassword>;
  getAllUsers(): Promise<IUserWithoutPassword[]>;
  getUserById(id: string): Promise<IUserWithoutPassword>;
  login(email: string, password: string): Promise<ILoginResponse>;
}
