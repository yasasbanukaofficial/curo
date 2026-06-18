import { Router } from "express";
import { authenticate } from "../middlewares";
import { createSecret, updateSecret } from "../controller/secret.controller";

const router = Router();

router.post("/save", authenticate, createSecret);
router.put("/update/:secretId", authenticate, updateSecret);
router.delete("/delete/:secretId", authenticate, createSecret);

export default router;
