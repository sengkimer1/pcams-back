// import { Request, Response } from "express";
// import { IUserCamp } from "../interfaces/createUserCamps";
// import {UserService} from "../services/userService";

// export class CreateUserCampController {
//   constructor(private userCampService: UserService) {}

//   async create(req: Request, res: Response): Promise<void> {
//     try {
//       const user: IUserCamp = req.body;
//       const result = await this.userCampService.createUserCamp(user);
//       res.status(201).json(result);
//     } catch (error: any) {
//       res.status(error.status || 500).json({ message: error.message });
//     }
//   }

//   async getAll(req: Request, res: Response): Promise<void> {
//     try {
//       const userCamps = await this.userCampService.getAllUserCamps();
//       res.status(200).json(userCamps);
//     } catch (error: any) {
//       res.status(error.status || 500).json({ message: error.message });
//     }
//   }

//   async getById(req: Request, res: Response): Promise<void> {
//     try {
//       const id = req.params.id;
//       const userCamp = await this.userCampService.getUserCampById(id);
//       res.status(200).json(userCamp);
//     } catch (error: any) {
//       res.status(error.status || 500).json({ message: error.message });
//     }
//   }
// }