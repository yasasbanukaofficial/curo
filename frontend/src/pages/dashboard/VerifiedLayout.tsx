import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsEmailVerified } from "../../features/auth/authSlice";
import { Mail } from "lucide-react";

export default function VerifiedLayout() {
  const isEmailVerified = useAppSelector(selectIsEmailVerified);

  if (!isEmailVerified) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
            <Mail className="w-8 h-8 text-[#636363]" />
          </div>
          <h2 className="text-xl font-semibold text-[#191919] dark:text-white mb-2">
            Verify your email
          </h2>
          <p className="text-sm text-[#636363] leading-relaxed">
            Please check your email inbox and click the verification link to access this page.
            Didn't receive an email? Check your spam folder or try signing up again.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
