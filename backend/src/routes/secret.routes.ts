import { Router } from "express";
import { authenticate } from "../middlewares";
import { saveSecret } from "../controller/secret.controller";

const router = Router();

router.post("/saveSec", authenticate, saveSecret);

export default router;
