import { Router } from "express";
import { googleCallback, googleLogin, login, register } from "../controller";
import { validate } from "../middlewares";
import { loginSchema, registerSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

export default router;
