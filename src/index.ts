import express, { Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes"; 
import childRoutes from "./routes/childrenRoutes";
import { AuthController } from "./controller/authController";
import { UserController } from "./controller/UserController";
import { ChildController } from "./controller/childrenController";
import { UserService } from "./services/userService";
import { ChildService } from "./services/childrenService";
import { connectPostgresDb } from "./config/db";
import { PostgresUserRepository } from "./repositories/userRepository";
import { PostgresChildRepository } from "./repositories/childrenRrsitory";
import { loggingMiddleware } from "./middlewares/logginMiddleware";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares/authMiddleware";


dotenv.config(); 

const app = express();
const PORT = 3000;

const pgPool = connectPostgresDb();

// Repository
const userRepository = new PostgresUserRepository(pgPool);
const childRepository = new PostgresChildRepository(pgPool)

// Service
const userService = new UserService(userRepository);
const childrenService = new ChildService(childRepository)

// Controller
const authController = new AuthController(userService);
const userController = new UserController(userService);
const childController = new ChildController(childrenService)

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/users", userRoutes(userController));
app.use("/api/child", childRoutes (childController))

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
