import { Router } from "express";
import { authenticate, validateProjectAccess, validateRole } from "../middlewares";
import {
  getAllProjects, getProjectById, createProject, updateProject, deleteProject,
  addTeamToProject, removeTeamFromProject,
  getAllProjectSecrets, createProjectSecret, updateProjectSecret, deleteProjectSecret,
  getAllProjectEnvironments, createProjectEnvironment, updateProjectEnvironment, deleteProjectEnvironment,
} from "../controller";

const router = Router();

router.get("/all", authenticate, getAllProjects);
router.get("/get/:projectId", authenticate, validateProjectAccess, getProjectById);
router.post("/create", authenticate, createProject);
router.put("/update/:projectId", authenticate, validateProjectAccess, validateRole("owner", "admin", "developer"), updateProject);
router.delete("/delete/:projectId", authenticate, validateProjectAccess, validateRole("owner"), deleteProject);
router.post("/:projectId/teams", authenticate, validateProjectAccess, validateRole("owner", "admin"), addTeamToProject);
router.delete("/:projectId/teams/:teamId", authenticate, validateProjectAccess, validateRole("owner", "admin"), removeTeamFromProject);

router.get("/:projectId/secrets", authenticate, validateProjectAccess, getAllProjectSecrets);
router.post("/:projectId/secrets", authenticate, validateProjectAccess, validateRole("owner", "admin", "developer"), createProjectSecret);
router.put("/:projectId/secrets/:secretId", authenticate, validateProjectAccess, validateRole("owner", "admin", "developer"), updateProjectSecret);
router.delete("/:projectId/secrets/:secretId", authenticate, validateProjectAccess, validateRole("owner", "admin"), deleteProjectSecret);

router.get("/:projectId/environments", authenticate, validateProjectAccess, getAllProjectEnvironments);
router.post("/:projectId/environments", authenticate, validateProjectAccess, validateRole("owner", "admin"), createProjectEnvironment);
router.put("/:projectId/environments/:environmentId", authenticate, validateProjectAccess, validateRole("owner", "admin"), updateProjectEnvironment);
router.delete("/:projectId/environments/:environmentId", authenticate, validateProjectAccess, validateRole("owner", "admin"), deleteProjectEnvironment);

export default router;
