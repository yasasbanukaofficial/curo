import { Router } from "express";
import { authenticate } from "../middlewares";
import { createProject, updateProject, deleteProject } from "../controller";

const router = Router();

router.post("/create", authenticate, createProject);
router.put("/update/:projectId", authenticate, updateProject);
router.delete("/delete/:projectId", authenticate, deleteProject);

export default router;
