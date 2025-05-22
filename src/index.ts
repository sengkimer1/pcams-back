import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Middleware
import { loggingMiddleware } from "./middlewares/logginMiddleware";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import campRoutes from "./routes/campRoutes";
import eventRoutes from "./routes/eventRoute";

// Controllers
import { AuthController } from "./controller/authController";
import { UserController } from "./controller/UserController";
import { CampController } from "./controller/campController";
import { EventController } from "./controller/eventController";

// Services
import { UserService } from "./services/userService";
import { CampService } from "./services/campService";
import { EventService } from "./services/eventService";

// Repositories
import { PostgresUserRepository } from "./repositories/userRepository";
import {PostgresCampRepository} from "./repositories/CampRepository";
import {PostgresEventRepository} from "./repositories/eventRepository";


// Config
import { connectPostgresDb } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const pgPool = connectPostgresDb();

// Add CORS Middleware
app.use(cors({
  origin: "http://localhost:5173",
}));

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Repositories
const userRepository = new PostgresUserRepository(pgPool);
const campRepository = new PostgresCampRepository(pgPool);
const eventRepository = new PostgresEventRepository(pgPool);

// Services
const userService = new UserService(userRepository);
const campService = new CampService(campRepository);
const eventService = new EventService(eventRepository);

// Controllers
const authController = new AuthController(userService);
const userController = new UserController(userService);
const campController = new CampController(campService);
const eventController = new EventController(eventService);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/users", userRoutes(userController));
app.use("/api/camps", campRoutes(campController));
app.use("/api/events", eventRoutes(eventController));

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});