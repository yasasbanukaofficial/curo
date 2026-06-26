import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { loginSchema, validateZod } from "../../types/auth";
import { loginWithGoogle, loginWithGithub } from "../../lib/auth";
import { useLoginMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setAuthenticated } from "../../features/auth/authSlice";
import { useToast } from "../../components/dashboard/Toast";
import type { LoginFormValues } from "../../types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const toast = useToast();

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validate: validateZod(loginSchema),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const result = await login(values).unwrap();
        if (result.success && result.data) {
          dispatch(setAuthenticated({
            user: {
              id: result.data.id || "",
              name: result.data.name || "",
              email: result.data.email || "",
              provider: [],
              emailVerified: false,
              createdAt: "",
            },
          }));
          toast.success("Welcome back", "You have been signed in successfully.");
          navigate("/dashboard");
        } else {
          setFieldError("email", result.msg || "Invalid email or password");
        }
      } catch (err: any) {
        const msg = err?.data?.msg || "Something went wrong. Please try again.";
        setFieldError("email", msg);
        toast.error("Login failed", msg);
      } finally {
        setSubmitting(false);
      }
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
