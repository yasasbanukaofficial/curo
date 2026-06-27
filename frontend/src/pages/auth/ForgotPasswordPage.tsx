import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { validateZod } from "../../types/auth";
import { useForgotPasswordMutation } from "../../features/auth/authApi";
import { useToast } from "../../components/dashboard/Toast";

const COOLDOWN = 60;

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export default function ForgotPasswordPage() {
  const [forgotPassword] = useForgotPasswordMutation();
  const toast = useToast();
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [countdown]);

  const formik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(forgotPasswordSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await forgotPassword(values).unwrap();
        if (result.success) {
          toast.success("Email sent", result.msg || "Check your inbox.");
          setCountdown(COOLDOWN);
        } else {
          toast.error("Failed", result.msg || "Something went wrong.");
        }
      } catch (err: any) {
        toast.error("Failed", err?.data?.msg || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isDisabled = formik.isSubmitting || countdown > 0;

  return (
    <AuthFormLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      showOAuth={false}
      bottomText="Remember your password?"
      bottomLinkText="Sign in"
      bottomLinkHref="/login"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
        <AuthField
          formik={formik}
          name="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={isDisabled}
        >
          {formik.isSubmitting ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Reset Link"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
