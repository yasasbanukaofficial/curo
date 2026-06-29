import crypto from "crypto";
import {
  UserModel,
  TeamMemberModel,
  TeamModel,
  ProjectModel,
  SecretsModel,
  EnvironmentModel,
  TeamInviteModel,
} from "../models";
import { IUser } from "../types";
import { tokenGen, verifyToken } from "../util/token";
import {
  oauth2Client,
  getGithubAccessToken,
  getGithubUserData,
  getGithubEmail,
} from "../integrations";
import { GOOGLE_OAUTH_CLIENT_ID } from "../config/env";
import { hash, encrypt } from "../util";
import { sendVerificationEmail, sendPasswordResetEmail } from "../util/email";

export const authService = {
  createUser: async (user: IUser) => {
    const { name, email, password } = user;

    const existingUser = await isExistingUser(email);

    if (existingUser) {
      return {
        success: false,
        status: 409,
        msg: "This email is already registered. Try logging in.",
      };
    }

    const hashedPass = await hash.gen(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString("hex");
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPass,
      emailVerificationOTP: otp,
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    sendVerificationEmail(email, otp, token);

    return {
      success: true,
      status: 201,
      msg: "Account created successfully! Please check your email to verify your account.",
      data: { id: newUser._id, name, email, verificationToken: token },
    };
  },
  authenticateUser: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return {
        success: false,
        status: 404,
        msg: "This email is not registered. Please sign up.",
      };
    }
    if (!existingUser.password || !hash.compare(password, existingUser.password)) {
      return {
        success: false,
        status: 401,
        msg: "Email and password don't match.",
      };
    }

    const accessToken = tokenGen.genAccessToken(existingUser);
    const refreshToken = tokenGen.genRefreshToken(existingUser);

    await existingUser.updateOne({ $push: { refreshTokens: refreshToken } });

    return {
      success: true,
      status: 200,
      msg: "Login successful",
      data: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  },

  handleGoogleOAuth: async (code: string) => {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Unable to sign in with Google. Please try again.");
    }

    const { sub: googleId, name, email } = payload;

    let user = await UserModel.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        googleId,
        provider: ["google"],
        emailVerified: true,
      });
    } else if (!user.googleId) {
      await user.updateOne({
        $set: { googleId },
        $addToSet: { provider: "google" },
      });
      user.googleId = googleId;
      user.provider.push("google");
    }

    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);

    const update: Record<string, any> = {
      $push: { refreshTokens: refreshToken },
    };

    if (tokens.refresh_token) {
      update.$set = { googleRefreshToken: encrypt.gen(tokens.refresh_token) };
    }

    await user.updateOne(update);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  handleGithubOAuth: async (code: string) => {
    const githubToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUserData(githubToken);

    if (!githubUser) {
      throw new Error("Unable to sign in with GitHub. Please try again.");
    }

    const { id: githubId, name } = githubUser.data;
    const email = await getGithubEmail(githubToken);

    if (!email) {
      throw new Error("No verified email address found on your GitHub account. Please make sure your email is public on GitHub.");
    }

    let user = await UserModel.findOne({
      $or: [{ email }, { githubId }],
    });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        githubId,
        provider: ["github"],
        emailVerified: true,
      });
    } else if (!user.githubId) {
      await user.updateOne({
        $set: { githubId },
        $addToSet: { provider: "github" },
      });
      user.githubId = githubId;
      user.provider.push("github");
    }

    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);

    await user.updateOne({
      $push: { refreshTokens: refreshToken },
      $set: {
        githubAccessToken: encrypt.gen(githubToken),
      },
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const decoded = verifyToken(refreshToken);

      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return { success: false, status: 404, msg: "Account not found. Please log in again." };
      }

      const tokenExists = user.refreshTokens.includes(refreshToken);
      if (!tokenExists) {
        return { success: false, status: 401, msg: "Your session has expired. Please log in again." };
      }

      const newAccessToken = tokenGen.genAccessToken(user);
      const newRefreshToken = tokenGen.genRefreshToken(user);

      await UserModel.findByIdAndUpdate(user._id, {
        $pull: { refreshTokens: refreshToken },
      }).then(() =>
        UserModel.findByIdAndUpdate(user._id, {
          $push: { refreshTokens: newRefreshToken },
        }),
      );

      return {
        success: true,
        status: 200,
        msg: "Tokens refreshed successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          userId: user._id.toString(),
          userEmail: user.email,
        },
      };
    } catch (error) {
      return { success: false, status: 401, msg: "Your session has expired. Please log in again." };
    }
  },

  getCurrentUser: async (userId: string) => {
    const user = await UserModel.findById(userId).select(
      "-password -refreshTokens -googleRefreshToken -githubAccessToken",
    );
    if (!user) {
      return { success: false, status: 404, msg: "Account not found" };
    }
    return {
      success: true,
      status: 200,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        googleId: user.googleId,
        githubId: user.githubId,
        emailVerified: user.emailVerified,
        onboardingComplete: user.onboardingComplete,
        onboardingSkipped: user.onboardingSkipped,
        createdAt: user.createdAt,
      },
    };
  },

  logoutUser: async (userId: string, refreshToken?: string) => {
    if (refreshToken) {
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      });
    }
    return { success: true, status: 200, msg: "Logged out successfully" };
  },

  verifyEmailOTP: async (userId: string | undefined, otp: string, token?: string) => {
    let user;
    if (userId) {
      user = await UserModel.findById(userId);
    } else if (token) {
      user = await UserModel.findOne({ emailVerificationToken: token });
      if (!user) {
        console.warn(`[verifyEmailOTP] Token lookup failed — token present but no user found`);
      }
    }
    if (!user && otp) {
      console.warn(`[verifyEmailOTP] Falling back to OTP lookup for otp=${otp}`);
      user = await UserModel.findOne({
        emailVerificationOTP: otp,
        emailVerificationExpires: { $gt: new Date() },
      });
    }
    if (!user) {
      return { success: false, status: 404, msg: "Account not found" };
    }
    if (user.emailVerified) {
      return { success: false, status: 400, msg: "This email is already verified" };
    }
    if (!user.emailVerificationOTP || !user.emailVerificationExpires) {
      return { success: false, status: 400, msg: "No verification code was found. Please request a new one." };
    }
    if (new Date() > user.emailVerificationExpires) {
      return { success: false, status: 400, msg: "This verification code has expired. Please request a new one." };
    }
    if (user.emailVerificationOTP !== otp) {
      return { success: false, status: 400, msg: "Invalid verification code" };
    }
    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);
    await UserModel.findByIdAndUpdate(user._id, {
      emailVerified: true,
      $push: { refreshTokens: refreshToken },
      $unset: { emailVerificationOTP: "", emailVerificationToken: "", emailVerificationExpires: "" },
    });

    return {
      success: true,
      status: 200,
      msg: "Email verified successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: true,
        provider: user.provider,
        accessToken,
        refreshToken,
      },
    };
  },

  verifyEmailToken: async (token: string) => {
    const user = await UserModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user) {
      return { success: false, status: 400, msg: "This verification link has expired or is invalid. Please request a new one." };
    }
    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);
    await UserModel.findByIdAndUpdate(user._id, {
      emailVerified: true,
      $push: { refreshTokens: refreshToken },
      $unset: { emailVerificationOTP: "", emailVerificationToken: "", emailVerificationExpires: "" },
    });
    return {
      success: true,
      status: 200,
      msg: "Email verified successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: true,
        provider: user.provider,
        accessToken,
        refreshToken,
      },
    };
  },

  resendVerification: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, status: 404, msg: "User not found" };
    }
    if (user.emailVerified) {
      return { success: false, status: 400, msg: "Email already verified" };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString("hex");
    await UserModel.findByIdAndUpdate(userId, {
      emailVerificationOTP: otp,
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    sendVerificationEmail(user.email, otp, token);
    return {
      success: true,
      status: 200,
      msg: "Verification email sent",
      data: { verificationToken: token },
    };
  },

  forgotPassword: async (email: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { success: false, status: 404, msg: "This account doesn't exist. Try a different email." };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString("hex");
    await UserModel.findByIdAndUpdate(user._id, {
      resetPasswordOTP: otp,
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    sendPasswordResetEmail(user.email, token);
    return {
      success: true,
      status: 200,
      msg: "Password reset email sent. Check your inbox.",
    };
  },

  resetPassword: async (token: string, newPassword: string) => {
    const user = await UserModel.findOne({
      $or: [
        { resetPasswordToken: token },
        { resetPasswordOTP: token },
      ],
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return { success: false, status: 400, msg: "This reset link has expired or is invalid. Please request a new one." };
    }
    if (user.password && hash.compare(newPassword, user.password)) {
      return { success: false, status: 400, msg: "You can't reuse your old password. Try a new one or login." };
    }
    const hashedPass = await hash.gen(newPassword);
    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPass,
      $unset: { resetPasswordOTP: "", resetPasswordToken: "", resetPasswordExpires: "" },
      $set: { refreshTokens: [] },
    });
    return { success: true, status: 200, msg: "Password reset successfully" };
  },

  disconnectProvider: async (userId: string, provider: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, status: 404, msg: "Account not found" };
    }
    const unset: Record<string, ""> = {};
    if (provider === "google") {
      unset.googleId = "";
    } else if (provider === "github") {
      unset.githubId = "";
    } else {
      return { success: false, status: 400, msg: "Invalid provider. Use 'google' or 'github'." };
    }
    await UserModel.findByIdAndUpdate(userId, {
      $unset: unset,
      $pull: { provider },
    });
    const providerName = provider === "google" ? "Google" : "GitHub";
    return { success: true, status: 200, msg: `${providerName} account disconnected successfully` };
  },

  linkGoogleAccount: async (code: string, userId: string) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token payload");

    const { sub: googleId } = payload;

    await UserModel.findByIdAndUpdate(userId, {
      $set: { googleId },
      $addToSet: { provider: "google" },
    });

    if (tokens.refresh_token) {
      await UserModel.findByIdAndUpdate(userId, {
        $set: { googleRefreshToken: encrypt.gen(tokens.refresh_token) },
      });
    }

    return { success: true };
  },

  linkGithubAccount: async (code: string, userId: string) => {
    const githubToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUserData(githubToken);

    if (!githubUser) {
      throw new Error("Unable to sign in with GitHub. Please try again.");
    }

    const { id: githubId } = githubUser.data;

    await UserModel.findByIdAndUpdate(userId, {
      $set: { githubId, githubAccessToken: encrypt.gen(githubToken) },
      $addToSet: { provider: "github" },
    });

    return { success: true };
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, status: 404, msg: "Account not found" };
    }
    if (!user.password) {
      return { success: false, status: 400, msg: "No password is set for this account. Please sign in with Google or GitHub." };
    }
    const passwordMatches = await hash.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return { success: false, status: 401, msg: "Current password is incorrect. Please try again." };
    }
    const hashedPass = await hash.gen(newPassword);
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPass,
      $set: { refreshTokens: [] },
    });
    return { success: true, status: 200, msg: "Password changed successfully" };
  },

  markOnboardingComplete: async (userId: string, skipped?: boolean) => {
    const update = skipped
      ? { onboardingSkipped: true }
      : { onboardingComplete: true };
    await UserModel.findByIdAndUpdate(userId, update);
    return { success: true, status: 200, msg: "Onboarding completed" };
  },

  deleteAccount: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, status: 404, msg: "Account not found" };
    }

    const memberships = await TeamMemberModel.find({ userId });

    for (const membership of memberships) {
      if (membership.role === "owner") {
        const teamId = membership.teamId;

        const teamProjects = await ProjectModel.find({ teamId });
        const projectIds = teamProjects.map((p) => p._id);

        if (projectIds.length > 0) {
          await SecretsModel.deleteMany({ projectId: { $in: projectIds } });
          await EnvironmentModel.deleteMany({ projectId: { $in: projectIds } });
          await ProjectModel.deleteMany({ _id: { $in: projectIds } });
        }

        await TeamMemberModel.deleteMany({ teamId });
        await TeamModel.findByIdAndDelete(teamId);
      } else {
        await TeamMemberModel.findByIdAndDelete(membership._id);
      }
    }

    await TeamInviteModel.deleteMany({ email: user.email });
    await UserModel.findByIdAndDelete(userId);

    return { success: true, status: 200, msg: "Account deleted successfully" };
  },
};

export const isExistingUser = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({
    email,
  });
  return !!user;
};
