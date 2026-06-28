import { Router } from "express";
import { authenticate } from "../middlewares";
import {
  getAllProjects, getProjectById, createProject, updateProject, deleteProject,
  addTeamToProject, removeTeamFromProject,
  getAllProjectSecrets, createProjectSecret, updateProjectSecret, deleteProjectSecret,
  getAllProjectEnvironments, createProjectEnvironment, updateProjectEnvironment, deleteProjectEnvironment,
} from "../controller";

const router = Router();

router.get("/all", authenticate, getAllProjects);
router.get("/get/:projectId", authenticate, getProjectById);
router.post("/create", authenticate, createProject);
router.put("/update/:projectId", authenticate, updateProject);
router.delete("/delete/:projectId", authenticate, deleteProject);
router.post("/:projectId/teams", authenticate, addTeamToProject);
router.delete("/:projectId/teams/:teamId", authenticate, removeTeamFromProject);

router.get("/:projectId/secrets", authenticate, getAllProjectSecrets);
router.post("/:projectId/secrets", authenticate, createProjectSecret);
router.put("/:projectId/secrets/:secretId", authenticate, updateProjectSecret);
router.delete("/:projectId/secrets/:secretId", authenticate, deleteProjectSecret);

router.get("/:projectId/environments", authenticate, getAllProjectEnvironments);
router.post("/:projectId/environments", authenticate, createProjectEnvironment);
router.put("/:projectId/environments/:environmentId", authenticate, updateProjectEnvironment);
router.delete("/:projectId/environments/:environmentId", authenticate, deleteProjectEnvironment);

export default router;
