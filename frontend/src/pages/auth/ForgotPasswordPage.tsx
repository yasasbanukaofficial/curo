import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { validateZod } from "../../types/auth";
import { useForgotPasswordMutation } from "../../store";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(forgotPasswordSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await forgotPassword({ email: values.email }).unwrap();
        setSent(true);
      } catch {
        // error handled by mutation
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (sent) {
    return (
      <AuthFormLayout
        title="Check your email"
        subtitle="If an account exists with that email, we've sent a password reset link."
        showOAuth={false}
        bottomText=""
        bottomLinkText="Back to sign in"
        bottomLinkHref="/login"
      >
        <p className="text-sm text-black/60 dark:text-white/60 text-center">
          Please check your inbox and follow the link to reset your password. If you don't see the
          email, check your spam folder.
        </p>
      </AuthFormLayout>
    );
  }

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
          disabled={formik.isSubmitting || isLoading}
        >
          {formik.isSubmitting || isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
