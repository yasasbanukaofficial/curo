import { Router } from "express";
import { githubCallback, githubLogin, googleCallback, googleLogin, login, me, refresh, register } from "../controller";
import { authenticate, validate } from "../middlewares";
import { loginSchema, refreshTokenSchema, registerSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refresh);
router.get("/me", authenticate, me);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

export default router;
