import { Router } from "express";
import { githubCallback, githubLogin, googleCallback, googleLogin, login, register } from "../controller";
import { validate } from "../middlewares";
import { loginSchema, registerSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

export default router;
