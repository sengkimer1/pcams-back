// ... other imports
import authRoutes from "./routes/authRoutes"; 
import { AuthController } from "./controller/authController";
import { UserService } from "./services/userService";
import { connectPostgresDb } from "./config/db";
import { PostgresUserRepository } from "./repositories/userRepository";
import { loggingMiddleware } from "./middlewares/logginMiddleware";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares/authMiddleware";
import { UserController } from "./controller/UserController";
import userRoutes from "./routes/userRoutes"; 
import { PostgresCampEventRepository } from "./repositories/PostgresCampEventRepository";
import { CampEventService } from "./services/campsEventsSerivce";
import { CampEventController } from "./controller/campEventController";
import campEventRoutes from "./routes/campEvetnRoutes"; 
import {PostgresCampRepository} from "./repositories/campRepository";
import {CampService} from "./services/campServices";
import {CampController} from "./controller/campController";
import campRoutes from "./routes/campRoute"; 

dotenv.config(); // Load .env

const app = express();
const PORT = 3000;

const pgPool = connectPostgresDb();

// Repository
const userRepository = new PostgresUserRepository(pgPool);
const campEventRepository = new PostgresCampEventRepository(pgPool);
const campRepository = new PostgresCampRepository(pgPool);
// Service
const userService = new UserService(userRepository);
const campEventService = new CampEventService(campEventRepository);
const campService = new CampService(campRepository);


// Controller
const authController = new AuthController(userService);
const userController = new UserController(userService);
const campEventController = new CampEventController(campEventService);
const campController = new CampController(campService);

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/camp-events", campEventRoutes(campEventController));
app.use("/api/camps", campRoutes(campController));

app.use("/api/users", userRoutes(userController));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
