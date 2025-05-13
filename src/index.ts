// ... other imports
import authRoutes from "./routes/authRoutes"; // Should be a function accepting a controller
import { AuthController } from "./controller/authController";
import { UserService } from "./services/userService";
import { connectPostgresDb } from "./config/db";
import { PostgresUserRepository } from "./repositories/userRepository";
import { loggingMiddleware } from "./middlewares/logginMiddleware";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares/authMiddleware";
import { UserController } from "./controller/UserController";
import userRoutes from "./routes/userRoutes"; // Should be a function accepting a controller

dotenv.config(); // Load .env

const app = express();
const PORT = 3000;

const pgPool = connectPostgresDb();

// Repository
const userRepository = new PostgresUserRepository(pgPool);

// Service
const userService = new UserService(userRepository);

// Controller
const authController = new AuthController(userService);
const userController = new UserController(userService);

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/users", authMiddleware, userRoutes(userController));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
