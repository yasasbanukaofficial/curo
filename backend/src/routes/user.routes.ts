import { Router } from "express";
import { getOverviewStats } from "../controller";
import { authenticate } from "../middlewares";

const router = Router();

router.get("/overview/stats", authenticate, getOverviewStats);

export default router;
