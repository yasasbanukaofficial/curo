import { Router } from "express";
import { authenticate } from "../middlewares";
import { createSecret, updateSecret, deleteSecret, getAllSecrets, getSecretById } from "../controller";

const router = Router();

router.get("/all", authenticate, getAllSecrets);
router.get("/get/:secretId", authenticate, getSecretById);
router.post("/save", authenticate, createSecret);
router.put("/update/:secretId", authenticate, updateSecret);
router.delete("/delete/:secretId", authenticate, deleteSecret);

export default router;
