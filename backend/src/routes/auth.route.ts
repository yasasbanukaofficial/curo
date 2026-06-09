import { Router } from "express";
import { login, register } from "../controller";
import { validate } from "../middlewares";
import { loginSchema, registerSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
