import express from "express";
import { connectDB } from "./config/db.js";

const app = express();

// database connection
connectDB()

export default app;
