import { useFormik } from "formik";
import { z } from "zod";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { validateZod } from "../../types/auth";
import { useForgotPasswordMutation } from "../../features/auth/authApi";
import { useToast } from "../../components/dashboard/Toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export default function ForgotPasswordPage() {
  const [forgotPassword] = useForgotPasswordMutation();
  const toast = useToast();

  const formik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(forgotPasswordSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await forgotPassword(values).unwrap();
        if (result.success) {
          toast.success("Email sent", "Check your inbox for the reset link.");
        } else {
          toast.error("Failed", result.msg || "Something went wrong.");
        }
      } catch {
        toast.error("Failed", "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
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
