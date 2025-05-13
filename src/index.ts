// ... other imports
import authRoutes from "./routes/authRoutes"; 
import { AuthController } from "./controller/authController";
import { UserService } from "./services/userService";
import { CampEventService } from "./services/campeventService";
import { connectPostgresDb } from "./config/db";
import { PostgresUserRepository } from "./repositories/userRepository";
import { PostgresCampEventRepository } from "./repositories/campEventRepository";
import { loggingMiddleware } from "./middlewares/logginMiddleware";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { CampEventController } from "./controller/campEventController";
import campevent from "./routes/campeventRoutes";

dotenv.config(); // Load .env

const app = express();
const PORT = 3000;

const pgPool = connectPostgresDb();

// Repository
const userRepository = new PostgresUserRepository(pgPool);
const campEventRepository = new PostgresCampEventRepository(pgPool);

// Service
const userService = new UserService(userRepository);
const campEventService = new CampEventService(campEventRepository);

// Controller
const authController = new AuthController(userService);
const campEventController = new CampEventController(campEventService)

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/campevent", campevent(campEventController))

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
