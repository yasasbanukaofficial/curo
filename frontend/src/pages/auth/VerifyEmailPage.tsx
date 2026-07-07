import { useEffect, useState, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthFormLayout from "../../components/ui/AuthFormLayout";
import { Button } from "../../components/ui/Button";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setError("");
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the full 6-digit code");
      return;
    }
  };

  if (!token) return null;

  return (
    <AuthFormLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code sent to your email"
      showOAuth={false}
      bottomText="Already verified?"
      bottomLinkText="Sign in"
      bottomLinkHref="/login"
    >
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black/[0.12] dark:border-white/[0.12] bg-white dark:bg-[#1A1A1A] text-black dark:text-white"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleSubmit}
        >
          Verify Email
        </Button>
      </div>
    </AuthFormLayout>
  );
}
