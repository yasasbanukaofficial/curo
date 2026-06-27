import { Router } from "express";
import { authenticate } from "../middlewares";
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, addTeamToProject, removeTeamFromProject } from "../controller";

const router = Router();

router.get("/all", authenticate, getAllProjects);
router.get("/get/:projectId", authenticate, getProjectById);
router.post("/create", authenticate, createProject);
router.put("/update/:projectId", authenticate, updateProject);
router.delete("/delete/:projectId", authenticate, deleteProject);
router.post("/:projectId/teams", authenticate, addTeamToProject);
router.delete("/:projectId/teams/:teamId", authenticate, removeTeamFromProject);

export default router;
