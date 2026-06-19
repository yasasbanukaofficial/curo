import { Router } from "express";
import { authenticate } from "../middlewares";
import { getAllEnvironments, getEnvironmentById, createEnvironment, updateEnvironment, deleteEnvironment } from "../controller";

const router = Router();

router.get("/all", authenticate, getAllEnvironments);
router.get("/get/:environmentId", authenticate, getEnvironmentById);
router.post("/create", authenticate, createEnvironment);
router.put("/update/:environmentId", authenticate, updateEnvironment);
router.delete("/delete/:environmentId", authenticate, deleteEnvironment);

export default router;
