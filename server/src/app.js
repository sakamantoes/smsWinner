import express from "express";
import { connectDB } from "./config/db.js";
import errorHandle from "./middleware/errorHandler.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import logsRoutes from "./routes/logs.js";
import cors from "cors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/auth", authRoutes);
app.use('/logs', logsRoutes);
// database connection
connectDB();

// global error
app.use(errorHandle);

export default app;
