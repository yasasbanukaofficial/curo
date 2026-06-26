import { z } from "zod";

export type SettingsTab = "general" | "account" | "billing";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  provider: string[];
  googleId?: string;
  githubId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsProfileValues {
  name: string;
  email: string;
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const settingsProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function validateZod<T>(schema: z.ZodSchema<T>) {
  return (values: T) => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = issue.message;
      }
      return errors;
    }
    return {};
  };
}
