import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { loginSchema, validateZod } from "../../types/auth";
import { useLoginMutation, setCredentials, baseApi } from "../../store";
import { useAppDispatch } from "../../app/store";
import { useToast } from "../../components/dashboard/Toast";
import type { LoginFormValues } from "../../types/auth";

export default function LoginPage() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validate: validateZod(loginSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await login({ email: values.email, password: values.password }).unwrap();
        dispatch(setCredentials({ user: result.user }));
        sessionStorage.removeItem("activeTeamId");
        dispatch(baseApi.util.resetApiState());
        navigate("/dashboard");
      } catch (err: any) {
        showError(err?.data?.msg || "Login failed");
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
      onGoogleLogin={() => { window.location.href = import.meta.env.VITE_API_URL + "/auth/google"; }}
      onGithubLogin={() => { window.location.href = import.meta.env.VITE_API_URL + "/auth/github"; }}
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
