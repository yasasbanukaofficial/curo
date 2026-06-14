import { Router } from "express";
import { testGithubSync } from "../controller/unifiedEvent.controller";

const router = Router();

router.post("/test/github-sync", testGithubSync);

export default router;
