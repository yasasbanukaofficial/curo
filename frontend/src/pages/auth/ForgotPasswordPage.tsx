import { useFormik } from "formik";
import { z } from "zod";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { validateZod } from "../../types/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export default function ForgotPasswordPage() {
  const formik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(forgotPasswordSchema),
    onSubmit: (values, { setSubmitting }) => {
      // TODO: Implement forgot password API call
      // POST /auth/forgot-password with email
      console.log("Forgot password for:", values.email);
      setSubmitting(false);
    },
  });

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
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
