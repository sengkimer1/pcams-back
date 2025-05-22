import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 

// Middleware
import { loggingMiddleware } from "./middlewares/logginMiddleware";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import childRoutes from "./routes/childrenRoutes";
import campEventRoutes from "./routes/campEvetnRoutes";
import campRoutes from "./routes/campRoute";
import attendanceRoutes from "./routes/attedanceTrackingRoute";
import dashboardRoutes from "./routes/dashboradRoutes";
import campUserRoutes from "./routes/campUserRoute";
import coordinatorRoutes from "./routes/coordinatorRoutes";

// Controllers
import { AuthController } from "./controller/authController";
import { UserController } from "./controller/UserController";
import { ChildController } from "./controller/childrenController";
import { EventcampController } from "./controller/campEventController";
import { CampController } from "./controller/campController";
import { AttendanceTrackingController } from "./controller/attendanceTrackingController";
import { DashboardController } from "./controller/dashboardController";
import { CampUserController } from "./controller/campUserController";
import { CoordinatorController } from "./controller/coordinatorController";

// Services
import { UserService } from "./services/userService";
import { ChildService } from "./services/childrenService";
import { CampEventService } from "./services/campsEventsSerivce";
import { CampService } from "./services/campServices";
import { AttendanceTrackingServiceImpl } from "./services/attendanceTrackingService";
import { DashboardService } from "./services/dashboardService";
import { PostgresCampUserService } from "./services/campUserServices";
import { CoordinatorAttendanceService } from "./services/coordinatorService";

// Repositories
import { PostgresUserRepository } from "./repositories/userRepository";
import { PostgresChildRepository } from "./repositories/childrenRrsitory";
import { PostgresCampEventRepository } from "./repositories/PostgresCampEventRepository";
import { PostgresCampRepository } from "./repositories/campRepository";
import { PostgresAttendanceTrackingRepository } from "./repositories/attendanceTrackingRepository";
import { PostgresDashboardRepository } from "./repositories/dashboardRepository";
import { PostgresCampUserRepository } from "./repositories/campUserRepository";
import { PostgresCoordinatorAttendanceRepository } from "./repositories/coordinatorRepository";
// Config
import { connectPostgresDb } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const pgPool = connectPostgresDb();

// ✅ Add CORS Middleware BEFORE routes
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  // credentials: true, // only if you're using cookies or sessions
}));

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Repositories
const userRepository = new PostgresUserRepository(pgPool);
const campEventRepository = new PostgresCampEventRepository(pgPool);
const campRepository = new PostgresCampRepository(pgPool);
const childRepository = new PostgresChildRepository(pgPool);
const attendanceTrackingRepository = new PostgresAttendanceTrackingRepository(pgPool);
const dashboardRepository = new PostgresDashboardRepository(pgPool);
const campUserRepository = new PostgresCampUserRepository(pgPool);
const coordinatorRepository = new PostgresCoordinatorAttendanceRepository(pgPool)

// Services
const campUserService = new PostgresCampUserService(campUserRepository);
const userService = new UserService(userRepository, campUserService);
const childrenService = new ChildService(childRepository);
const campEventService = new CampEventService(campEventRepository);
const campService = new CampService(campRepository);
const attendanceTrackingService = new AttendanceTrackingServiceImpl(attendanceTrackingRepository);
const dashboardService = new DashboardService(dashboardRepository);
// const campUserService = new PostgresCampUserService(campUserRepository);
const coordinatorAttendanceService = new CoordinatorAttendanceService(coordinatorRepository)


// Controllers
const authController = new AuthController(userService);
const userController = new UserController(userService);
const childController = new ChildController(childrenService);
const campEventController = new EventcampController(campEventService);
const campController = new CampController(campService);
const attendanceTrackingController = new AttendanceTrackingController(attendanceTrackingService);
const dashboardController = new DashboardController(dashboardService);
const campUserController = new CampUserController(campUserService);
const coordinatorController = new CoordinatorController(coordinatorAttendanceService)

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/camp-events", campEventRoutes(campEventController));
app.use("/api/camps", campRoutes(campController));
app.use("/api/users", userRoutes(userController));
app.use("/api/child", childRoutes(childController));
app.use("/api/attendance", attendanceRoutes(attendanceTrackingController));
app.use("/api/dashboard", dashboardRoutes(dashboardController));
app.use("/api/camp-user", campUserRoutes(campUserController));
app.use("/api/coordinator",coordinatorRoutes(coordinatorController));
// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
