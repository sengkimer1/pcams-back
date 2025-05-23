"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Middleware
const logginMiddleware_1 = require("./middlewares/logginMiddleware");
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const campRoutes_1 = __importDefault(require("./routes/campRoutes"));
const eventRoute_1 = __importDefault(require("./routes/eventRoute"));
const campEventRoutes_1 = __importDefault(require("./routes/campEventRoutes"));
const campEventOrganizerRoutes_1 = __importDefault(require("./routes/campEventOrganizerRoutes"));
const childAttendanceRoutes_1 = __importDefault(require("./routes/childAttendanceRoutes"));
// Controllers
const authController_1 = require("./controller/authController");
const UserController_1 = require("./controller/UserController");
const campController_1 = require("./controller/campController");
const eventController_1 = require("./controller/eventController");
const campEventController_1 = require("./controller/campEventController");
const campEventOrganizerController_1 = require("./controller/campEventOrganizerController");
const childrenAttendanceController_1 = require("./controller/childrenAttendanceController");
// Services
const userService_1 = require("./services/userService");
const campService_1 = require("./services/campService");
const eventService_1 = require("./services/eventService");
const campEventService_1 = require("./services/campEventService");
const campEventOrganizerService_1 = require("./services/campEventOrganizerService");
const childAttendanceServices_1 = require("./services/childAttendanceServices");
// Repositories
const userRepository_1 = require("./repositories/userRepository");
const CampRepository_1 = require("./repositories/CampRepository");
const eventRepository_1 = require("./repositories/eventRepository");
const campEventRepository_1 = require("./repositories/campEventRepository");
const campEventOrganizerRepository_1 = require("./repositories/campEventOrganizerRepository");
const childAttendanceRepository_1 = require("./repositories/childAttendanceRepository");
// Config
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const pgPool = (0, db_1.connectPostgresDb)();
// Add CORS Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
// Middleware
app.use(express_1.default.json());
app.use(logginMiddleware_1.loggingMiddleware);
// Repositories
const userRepository = new userRepository_1.PostgresUserRepository(pgPool);
const campRepository = new CampRepository_1.PostgresCampRepository(pgPool);
const eventRepository = new eventRepository_1.PostgresEventRepository(pgPool);
const campEventRepository = new campEventRepository_1.PostgresCampEventRepository(pgPool);
const campEventOrganizerRepository = new campEventOrganizerRepository_1.PostgresCampEventOrganizerRepository(pgPool);
const childAttendanceRepository = new childAttendanceRepository_1.PostgresChildAttendanceRepository(pgPool);
// Services
const userService = new userService_1.UserService(userRepository);
const campService = new campService_1.CampService(campRepository);
const eventService = new eventService_1.EventService(eventRepository);
const campEventService = new campEventService_1.CampEventService(campEventRepository);
const campEventOrganizerService = new campEventOrganizerService_1.CampEventOrganizerService(campEventOrganizerRepository);
const childAttendanceService = new childAttendanceServices_1.ChildAttendanceService(childAttendanceRepository);
// Controllers
const authController = new authController_1.AuthController(userService);
const userController = new UserController_1.UserController(userService);
const campController = new campController_1.CampController(campService);
const eventController = new eventController_1.EventController(eventService);
const campEventController = new campEventController_1.CampEventController(campEventService);
const campEventOrganizerController = new campEventOrganizerController_1.CampEventOrganizerController(campEventOrganizerService);
const childAttendanceController = new childrenAttendanceController_1.ChildAttendanceController(childAttendanceService);
// Routes
app.use("/api/auth", (0, authRoutes_1.default)(authController));
app.use("/api/users", (0, userRoutes_1.default)(userController));
app.use("/api/camps", (0, campRoutes_1.default)(campController));
app.use("/api/events", (0, eventRoute_1.default)(eventController));
app.use("/api/campevents", (0, campEventRoutes_1.default)(campEventController));
app.use("/api/campeventorganizers", (0, campEventOrganizerRoutes_1.default)(campEventOrganizerController));
app.use("/api/childattendances", (0, childAttendanceRoutes_1.default)(childAttendanceController));
// Error Handling Middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
});
// Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
