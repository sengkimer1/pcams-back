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
import campEventRoutes from "./routes/campEventRoutes";
import campEventOrganizerRoutes from "./routes/campEventOrganizerRoutes";
import childAttendanceRoutes from "./routes/childAttendanceRoutes";
import coordinatorRoutes from "./routes/dashboardRoutes";
// Controllers
import { AuthController } from "./controller/authController";
import { UserController } from "./controller/UserController";
import { CampController } from "./controller/campController";
import { EventController } from "./controller/eventController";
import { CampEventController } from "./controller/campEventController";
import { CampEventOrganizerController } from "./controller/campEventOrganizerController";
import {ChildAttendanceController} from "./controller/childrenAttendanceController";
import { DashboardController } from "./controller/dashboardController";
// Services
import { UserService } from "./services/userService";
import { CampService } from "./services/campService";
import { EventService } from "./services/eventService";
import { CampEventService } from "./services/campEventService";
import { CampEventOrganizerService } from "./services/campEventOrganizerService";
import { ChildAttendanceService } from "./services/childAttendanceServices";
import { DashboardService } from "./services/dashboardService";
// Repositories
import { PostgresUserRepository } from "./repositories/userRepository";
import {PostgresCampRepository} from "./repositories/CampRepository";
import {PostgresEventRepository} from "./repositories/eventRepository";
import {PostgresCampEventRepository} from "./repositories/campEventRepository";
import {PostgresCampEventOrganizerRepository} from "./repositories/campEventOrganizerRepository";
import {PostgresChildAttendanceRepository} from "./repositories/childAttendanceRepository";
import { PostgresDashboardRepository } from "./repositories/dashbordRepository";

// Config
import { connectPostgresDb } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const pgPool = connectPostgresDb();

// Add CORS Middleware
app.use(cors({
  origin: "http://127.0.0.1:3308",
}));

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Repositories
const userRepository = new PostgresUserRepository(pgPool);
const campRepository = new PostgresCampRepository(pgPool);
const eventRepository = new PostgresEventRepository(pgPool);
const campEventRepository = new PostgresCampEventRepository(pgPool);
const campEventOrganizerRepository = new PostgresCampEventOrganizerRepository(pgPool);
const childAttendanceRepository = new PostgresChildAttendanceRepository(pgPool);
const coordiantorRepository = new PostgresDashboardRepository(pgPool);
// Services
const userService = new UserService(userRepository);
const campService = new CampService(campRepository);
const eventService = new EventService(eventRepository);
const campEventService = new CampEventService(campEventRepository);
const campEventOrganizerService = new CampEventOrganizerService(campEventOrganizerRepository);
const childAttendanceService = new ChildAttendanceService(childAttendanceRepository);
const dashboardService = new DashboardService(coordiantorRepository);
// Controllers
const authController = new AuthController(userService, campEventOrganizerService);
const userController = new UserController(userService);
const campController = new CampController(campService);
const eventController = new EventController(eventService);
const campEventController = new CampEventController(campEventService);
const campEventOrganizerController = new CampEventOrganizerController(campEventOrganizerService);
const childAttendanceController = new ChildAttendanceController(childAttendanceService);
const coordinatorController = new DashboardController(dashboardService);
// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/users", userRoutes(userController));
app.use("/api/camps", campRoutes(campController));
app.use("/api/events", eventRoutes(eventController));
app.use("/api/campevents", campEventRoutes(campEventController));
app.use("/api/campeventorganizers", campEventOrganizerRoutes(campEventOrganizerController));
app.use("/api/childattendances", childAttendanceRoutes(childAttendanceController));
app.use("/api/dashboard",coordinatorRoutes(coordinatorController));

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});