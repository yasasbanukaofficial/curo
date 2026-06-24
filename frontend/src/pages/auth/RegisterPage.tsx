import { useFormik } from "formik";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { registerSchema, validateZod } from "../../types/auth";
import { registerUser, loginWithGoogle, loginWithGithub } from "../../lib/auth";
import type { RegisterFormValues } from "../../types/auth";

export default function RegisterPage() {
  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateZod(registerSchema),
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      registerUser(values).catch(() => {
        setFieldError("email", "An account with this email already exists");
        setSubmitting(false);
      });
    },
  });

  return (
    <AuthFormLayout
      title="Create your account"
      subtitle="Get started with Curo in minutes"
      bottomText="Already have an account?"
      bottomLinkText="Sign in"
      bottomLinkHref="/login"
      onGoogleLogin={loginWithGoogle}
      onGithubLogin={loginWithGithub}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
        <AuthField
          formik={formik}
          name="name"
          label="Full name"
          placeholder="John Doe"
          autoComplete="name"
        />
        <AuthField
          formik={formik}
          name="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
        <AuthField
          formik={formik}
          name="password"
          label="Password"
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
          {formik.isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
