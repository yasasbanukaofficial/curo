import { Resend } from "resend";
import { RESEND_API_KEY, BASE_URL, API_VER, FRONTEND_URL } from "../config/env";

const apiPrefix = API_VER ? `/api/${API_VER}` : "/api/v1";

function getResend() {
  if (!RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY — verification emails will not be sent.");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

export async function sendVerificationEmail(
  to: string,
  otp: string,
  token: string,
) {
  const resend = getResend();
  if (!resend) return;

  if (!BASE_URL) {
    console.warn("Missing BASE_URL — verify-email link will be broken in emails.");
    return;
  }

  const base = BASE_URL.replace(/\/+$/, "");
  const link = `${base}${apiPrefix}/auth/verify-email/token/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Curo <onboarding@resend.dev>",
      to,
      subject: "Verify your email",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #191919;">Verify your email</h1>
          <p style="font-size: 14px; color: #636363; margin-bottom: 24px;">Use the code below or click the button to verify your email address.</p>
          <div style="background: #F5F5F7; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #636363; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Verification code</p>
            <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #191919; margin: 0;">${otp}</p>
          </div>
          <a href="${link}" style="display: block; text-align: center; padding: 12px 24px; background: #191919; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; margin-bottom: 24px;">Verify email</a>
          <p style="font-size: 12px; color: #A3A3A3; text-align: center;">This code expires in 10 minutes. If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
    }
    return data;
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
}

export async function sendTeamInviteEmail(
  to: string,
  teamName: string,
  inviterName: string,
  token: string,
  expiresAt: Date,
) {
  const resend = getResend();
  if (!resend) return;

  if (!FRONTEND_URL) {
    console.warn("Missing FRONTEND_URL — team invite link will be broken in emails.");
    return;
  }

  const frontend = FRONTEND_URL.replace(/\/+$/, "");
  const link = `${frontend}/invite/accept/${token}`;

  const expiresFormatted = expiresAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "Curo <onboarding@resend.dev>",
      to,
      subject: `You're invited to join ${teamName} on Curo`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #191919;">You're invited!</h1>
          <p style="font-size: 14px; color: #636363; margin-bottom: 24px;">${inviterName} has invited you to join <strong>${teamName}</strong> on Curo.</p>
          <a href="${link}" style="display: block; text-align: center; padding: 12px 24px; background: #191919; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; margin-bottom: 24px;">Accept Invite</a>
          <p style="font-size: 12px; color: #A3A3A3; text-align: center;">This invite expires on ${expiresFormatted}. If you don't have an account, you'll be asked to create one.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
    }
    return data;
  } catch (err) {
    console.error("Failed to send team invite email:", err);
  }
}

export async function sendPasswordResetEmail(
  to: string,
  token: string,
) {
  const resend = getResend();
  if (!resend) return;

  if (!FRONTEND_URL) {
    console.warn("Missing FRONTEND_URL — reset-password link will be broken in emails.");
    return;
  }

  const frontend = FRONTEND_URL.replace(/\/+$/, "");
  const link = `${frontend}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Curo <onboarding@resend.dev>",
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #191919;">Reset your password</h1>
          <p style="font-size: 14px; color: #636363; margin-bottom: 24px;">Click the button below to reset your password.</p>
          <a href="${link}" style="display: block; text-align: center; padding: 12px 24px; background: #191919; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; margin-bottom: 24px;">Reset password</a>
          <p style="font-size: 12px; color: #A3A3A3; text-align: center;">This link expires in 10 minutes. If you didn't request a password reset, you can ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
    }
    return data;
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }
}
