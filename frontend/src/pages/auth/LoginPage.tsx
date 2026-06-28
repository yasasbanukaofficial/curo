import { useFormik } from "formik";
import { Link, useSearchParams } from "react-router-dom";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { loginSchema, validateZod } from "../../types/auth";
import { loginWithGoogle, loginWithGithub } from "../../lib/auth";
import type { LoginFormValues } from "../../types/auth";

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validate: validateZod(loginSchema),
    onSubmit: (_values, { setSubmitting }) => {
      setSubmitting(false);
    },
  });

  return (
    <AuthFormLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
      bottomText="Don't have an account?"
      bottomLinkText="Register"
      bottomLinkHref="/register"
      onGoogleLogin={loginWithGoogle}
      onGithubLogin={loginWithGithub}
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

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#636363]"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#191919] hover:text-[#636363] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <AuthField
            formik={formik}
            name="password"
            label=""
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
