import { Router } from "express";
import { getAuthUser, googleSetup } from "../controller/auth.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/google", googleSetup);
router.get("/me", authMiddleware, getAuthUser);

export default router;
