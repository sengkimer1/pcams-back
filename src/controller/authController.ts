import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces/userinterfaces";
import { CampEventOrganizerService } from "../services/campEventOrganizerService";
import { logger } from "../services/loggerService";

export class AuthController {
  constructor(
    private userService: IUserService,
    private campEventOrganizerService: CampEventOrganizerService
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
      }

      const result = await this.userService.login(email, password);
      const { user, token } = result; // Assuming userService.login returns { user, token }

      // Fetch camp events for the user
      const campEvents = user.id 
        ? await this.campEventOrganizerService.getCampEventsByUserId(user.id) 
        : [];

      logger.info("Login successful", { email });
      res.status(200).json({
        message: "Login successful",
        data: {
          user,
          token,
          campEvents, // Include camp events in the response
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.error("Login error", { error: err.message, email: req.body.email });
      } else {
        logger.error("Login error", { error: "Unknown error", email: req.body.email });
      }
      next(err);
    }
  }
}
