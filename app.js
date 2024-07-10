import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/books.route.js";

dotenv.config();
const app = express();

// Use CORS middleware
app.use(cors());

// Use cookie parser middleware
app.use(cookieParser());

// Use morgan middleware for logging
app.use(morgan("tiny"));

// Use regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use user routes
app.use('/api/v1', bookRoutes);
app.use("/api/v1", userRoutes);

export default app;
