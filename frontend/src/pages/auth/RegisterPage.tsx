import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import AuthField from "../../components/ui/AuthField";
import { Button } from "../../components/ui/Button";
import { registerSchema, validateZod } from "../../types/auth";
import { useRegisterMutation, useVerifyEmailMutation, useResendOtpMutation, setCredentials } from "../../store";
import { useAppDispatch } from "../../app/store";
import { useToast } from "../../components/dashboard/Toast";
import type { RegisterFormValues } from "../../types/auth";

export default function RegisterPage() {
  const [register] = useRegisterMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useToast();

  const [showOtpStep, setShowOtpStep] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateZod(registerSchema),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await register({
          name: values.name,
          email: values.email,
          password: values.password,
        }).unwrap();
        if (result.user) {
          dispatch(setCredentials({ user: result.user }));
          navigate("/dashboard");
        } else {
          setShowOtpStep(true);
          setEmailForOtp(values.email);
          showSuccess("Account created! Please check your email for the verification code.");
        }
      } catch (err: any) {
        showError(err?.data?.msg || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [otp, setOtp] = useState("");

  async function handleVerifyOtp() {
    try {
      const result = await verifyEmail({ otp, token: undefined }).unwrap();
      dispatch(setCredentials({ user: result.user }));
      navigate("/dashboard");
    } catch (err: any) {
      showError(err?.data?.msg || "Verification failed");
    }
  }

  async function handleResendOtp() {
    try {
      await resendOtp(undefined).unwrap();
      showSuccess("Verification code resent");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to resend code");
    }
  }

  if (showOtpStep) {
    return (
      <AuthFormLayout
        title="Verify your email"
        subtitle={"Enter the 6-digit code sent to " + emailForOtp}
        bottomText=""
        bottomLinkText=""
        bottomLinkHref=""
        showOAuth={false}
      >
        <div className="space-y-5">
          <AuthField
            formik={{ values: { otp }, errors: {}, touched: {}, handleChange: (e: any) => setOtp(e.target.value) } as any}
            name="otp"
            label="Verification Code"
            placeholder="000000"
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full rounded-full border-accent !bg-[#FF3333] !text-white !py-2.5"
            onClick={handleVerifyOtp}
          >
            Verify Email
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            onClick={handleResendOtp}
          >
            Resend Code
          </Button>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Create your account"
      subtitle="Get started with Curo in minutes"
      bottomText="Already have an account?"
      bottomLinkText="Sign in"
      bottomLinkHref="/login"
      onGoogleLogin={() => { window.location.href = import.meta.env.VITE_API_URL + "/auth/google"; }}
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
          variant="outline"
          size="md"
          className="w-full rounded-full border-accent !bg-[#FF3333] !text-white !py-2.5"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
