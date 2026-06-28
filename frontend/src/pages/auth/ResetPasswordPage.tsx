import { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { validateZod } from "../../types/auth";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validate: validateZod(resetPasswordSchema),
    onSubmit: (_values, { setSubmitting }) => {
      setSubmitting(false);
    },
  });

  return (
    <AuthFormLayout
      title="Set new password"
      subtitle="Enter your new password below"
      showOAuth={false}
      bottomText="Remember your password?"
      bottomLinkText="Sign in"
      bottomLinkHref="/login"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
        <AuthField
          formik={formik}
          name="password"
          label="New password"
          type="password"
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
        />
        <AuthField
          formik={formik}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
