import { Router } from "express";
import { authenticate } from "../middlewares";
import { createVersion, getAllVersions } from "../controller";

const router = Router();

router.post("/save", authenticate, createVersion);
router.get("/all/:secretId", authenticate, getAllVersions);

export default router;
