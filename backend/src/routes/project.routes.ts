import { Router } from "express";
import { authenticate } from "../middlewares";
import { getAllProjects, createProject, updateProject, deleteProject } from "../controller";

const router = Router();

router.get("/all", authenticate, getAllProjects);
router.post("/create", authenticate, createProject);
router.put("/update/:projectId", authenticate, updateProject);
router.delete("/delete/:projectId", authenticate, deleteProject);

export default router;
