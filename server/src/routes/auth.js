import { Router } from "express";
import { googleSetup } from "../controller/auth.js";

const router = Router();

router.post("/google", googleSetup);

export default router;
