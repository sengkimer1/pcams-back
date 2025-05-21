import {
    IUser,
    IUserWithoutPassword,
    ILoginResponse,
    IUserRepository,
    IUserService,
  } from "./userinterfaces";
  import { CampUser } from "./campUserInterface";
  
  // Extend IUser to include camp_id for user camp creation
  export interface IUserCamp extends Omit<IUser, "id"> {
    camp_id: string;
  }
  
  
  
  // Extend IUserRepository for user camp operations
  export interface IUserCampRepository {
    createUserCamp(user: IUserCamp, client?: any): Promise<{ user: IUserWithoutPassword; campUser: CampUser }>;
    findAllUserCamps(): Promise<(IUserWithoutPassword & { camp_id: string })[]>;
    findUserCampById(id: string): Promise<(IUserWithoutPassword & { camp_id: string }) | null>;
  }
  // Extend IUserService for user camp operations
  export interface IUserCampService {
    createUserCamp(user: IUserCamp): Promise<{ user: IUserWithoutPassword; campUser: CampUser; token: string }>;
    getAllUserCamps(): Promise<(IUserWithoutPassword & { camp_id: string })[]>;
    getUserCampById(id: string): Promise<IUserWithoutPassword & { camp_id: string }>;
  }