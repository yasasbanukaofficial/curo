import { Router } from "express";
import { authenticate } from "../middlewares";
import { getAllAudits } from "../controller";

const router = Router();

router.get("/all", authenticate, getAllAudits);

export default router;
