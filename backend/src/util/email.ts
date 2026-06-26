import { Resend } from "resend";
import { RESEND_API_KEY, BASE_URL, API_VER } from "../config/env";

if (!RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY — verification emails will not be sent.");
}
if (!BASE_URL) {
  throw new Error("Missing BASE_URL — verify-email link will be broken in emails.");
}

const resend = new Resend(RESEND_API_KEY);
const apiPrefix = API_VER ? `/api/${API_VER}` : "/api/v1";

export async function sendVerificationEmail(
  to: string,
  otp: string,
  token: string,
) {
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
