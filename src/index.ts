import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Middleware
import { loggingMiddleware } from "./middlewares/logginMiddleware";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

// Controllers
import { AuthController } from "./controller/authController";
import { UserController } from "./controller/UserController";

// Services
import { UserService } from "./services/userService";

// Repositories
import { PostgresUserRepository } from "./repositories/userRepository";

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

// Services
const userService = new UserService(userRepository);

// Controllers
const authController = new AuthController(userService);
const userController = new UserController(userService);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/users", userRoutes(userController));

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});