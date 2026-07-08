import { useEffect, useState, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import Logo from "./Logo";
import PixelBlast from "../animations/PixelBlast";

interface AuthFormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showOAuth?: boolean;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkHref: string;
  onGoogleLogin?: () => void;
}

export default function AuthFormLayout({
  children,
  title,
  subtitle,
  showOAuth = true,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  onGoogleLogin,
}: AuthFormLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("curo-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("curo-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === "light" ? "dark" : "light");
  }

  return (
    <section className="relative min-h-screen bg-white dark:bg-black">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center rounded-full border border-black/[0.04] dark:border-[#333] p-1 overflow-hidden"
          aria-label="Toggle Theme"
        >
          <Sun className={`size-7 p-1.5 text-[#636363] dark:text-accent rounded-full ${theme === "dark" ? "" : "bg-accent/10"}`} />
          <Moon className={`size-7 p-1.5 text-accent dark:text-[#636363] rounded-full ${theme === "dark" ? "bg-accent/10" : ""}`} />
        </button>
      </div>
      <div className="absolute inset-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#FF3333"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          edgeFade={0.25}
          centerFade={0.25}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-[2px]" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-block mb-6">
              <Logo size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-black dark:text-white font-sans">
              {title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-black/60 dark:text-white/60 font-sans">
              {subtitle}
            </p>
          </div>

        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.08] p-6 sm:p-10">
          {children}
        </div>

        {showOAuth && (
          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/[0.04] dark:border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 text-accent font-sans">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onGoogleLogin}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 sm:py-3.5 border border-accent rounded-lg bg-transparent text-sm text-accent font-button cursor-pointer"
              >
                <GoogleLogo className="h-4 w-4 sm:h-5 sm:w-5" />
                Google
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-black/60 dark:text-white/60 font-sans">
          {bottomText}{" "}
          <a
            href={bottomLinkHref}
            className="font-medium text-black dark:text-white hover:text-black/60 dark:hover:text-white/60 transition-colors"
          >
            {bottomLinkText}
          </a>
        </p>
        </div>
      </div>
    </section>
  );
}

function GoogleLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
