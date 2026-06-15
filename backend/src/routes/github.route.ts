import { Router } from "express";
import { authenticate } from "../middlewares";
import { fetchGithubRepos } from "../controller/github.controller";

const router = Router();

router.get("/repos", authenticate, fetchGithubRepos);

export default router;
