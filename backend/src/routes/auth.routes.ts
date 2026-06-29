import { Router } from "express";
import { registerUser, loginUser, initiateGoogleAuth, handleGoogleCallback, initiateGithubAuth, handleGithubCallback, refreshToken, getCurrentUser, logoutUser, verifyEmailOTP, verifyEmailToken, resendVerification, forgotPassword, resetPassword, changePassword, disconnectOAuth, markOnboardingComplete, deleteAccount } from "../controller";
import { authenticate, validate } from "../middlewares";
import { loginSchema, refreshTokenSchema, registerSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", validate(refreshTokenSchema), refreshToken);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logoutUser);
router.post("/verify-email/otp", validate(verifyOtpSchema), verifyEmailOTP);
router.get("/verify-email/token/:token", verifyEmailToken);
router.post("/verify-email/resend", authenticate, resendVerification);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.put("/change-password", authenticate, validate(changePasswordSchema), changePassword);
router.post("/disconnect-oauth", authenticate, disconnectOAuth);
router.get("/google", initiateGoogleAuth);
router.get("/google/connect", initiateGoogleAuth);
router.get("/google/callback", handleGoogleCallback);
router.get("/github", initiateGithubAuth);
router.get("/github/connect", initiateGithubAuth);
router.get("/github/callback", handleGithubCallback);
router.patch("/onboarding-complete", authenticate, markOnboardingComplete);
router.delete("/account", authenticate, deleteAccount);

export default router;
