import { Router } from "express";
import { registerUser, loginUser, loginWithGoogle, handleGoogleCallback, loginWithGithub, handleGithubCallback, refreshToken, getCurrentUser } from "../controller";
import { authenticate, validate } from "../middlewares";
import { loginSchema, refreshTokenSchema, registerSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", validate(refreshTokenSchema), refreshToken);
router.get("/me", authenticate, getCurrentUser);
router.get("/google", loginWithGoogle);
router.get("/google/callback", handleGoogleCallback);
router.get("/github", loginWithGithub);
router.get("/github/callback", handleGithubCallback);

export default router;
