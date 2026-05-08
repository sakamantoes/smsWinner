import express from "express";
import { connectDB } from "./config/db.js";
import errorHandle from "./middleware/errorHandler.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://sms-winner.vercel.app"],
    credentials: true,
  }),
);
app.use(cookieParser());

// routes
app.use("/auth", authRoutes);

// database connection
connectDB();

// global error
app.use(errorHandle);

export default app;
