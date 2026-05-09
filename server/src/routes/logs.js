import express from "express";

const router = express.Router();

import {
  createLog,
  getLogs,
  buyLog,
  updateLog,
  deleteLog,
  myPurchasedLogs
} from "../controller/logs.js";
import validateLog from '../validator/log.validator.js'
import { validateData } from "../validator/validator.js";
import authMiddleware, { validateAdminRole, validateUserRole } from "../middleware/authMiddleware.js";


// CREATE
router.post("/create", validateLog, validateData, authMiddleware, validateAdminRole, createLog);

// GET ALL
router.get("/", validateData, authMiddleware, getLogs);

// BUY
router.post("/buy/:id", validateData, authMiddleware, validateUserRole, buyLog);

// UPDATE
router.put("/update/:id",validateLog, validateData, authMiddleware,validateAdminRole, updateLog);

// DELETE
router.delete("/delete/:id",authMiddleware, validateAdminRole, deleteLog);

// PURCHASE HISTORY
router.get("/my-logs", authMiddleware, myPurchasedLogs);

export default router;