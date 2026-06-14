import { Router } from "express";
import { fetchGithubData } from "../controller/unifiedEvent.controller";
import { authenticate } from "../middlewares";

const router = Router();

router.post("/github-data", authenticate, fetchGithubData);

export default router;
