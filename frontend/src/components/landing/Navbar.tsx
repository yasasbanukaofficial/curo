import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import CuroLogo from "./CuroLogo";
import { Button } from "../ui/Button";
import { GitHubIcon } from "../ui/Icons";

const navLinks = [
  { label: "Docs", href: "#" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("curo-theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("curo-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === "light" ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-40 h-20">
      <div className="backdrop-blur-lg border-b border-black/[0.04] dark:border-[#222] bg-white/80 dark:bg-black/80 transition-colors">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="flex h-20 w-full items-center">
            <CuroLogo size="sm" />

            <ul className="flex flex-row items-center gap-1 px-6 max-sm:hidden">
              {navLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1 p-2 text-sm text-[#636363] dark:text-[#9A9A9A] transition-colors hover:text-black dark:hover:text-white rounded-md"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-row items-center justify-end gap-1.5 flex-1 max-lg:hidden">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center rounded-full border border-black/[0.04] dark:border-[#333] p-1 overflow-hidden"
                aria-label="Toggle Theme"
              >
                <Sun className={`size-7 p-1.5 text-[#636363] dark:text-accent rounded-full ${theme === "dark" ? "" : "bg-accent/10"}`} />
                <Moon className={`size-7 p-1.5 text-accent dark:text-[#636363] rounded-full ${theme === "dark" ? "bg-accent/10" : ""}`} />
              </button>

              <a
                href="https://github.com/yasasbanukaofficial/curo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-1.5 text-[#636363] dark:text-[#9A9A9A] hover:text-black dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>

              <a href="/login" className="text-sm font-medium text-[#636363] dark:text-[#9A9A9A] hover:text-black dark:hover:text-white transition-colors px-3">
                Sign In
              </a>
              <Button variant="secondary" href="/register" size="sm">Get Started</Button>
            </div>

            <div className="flex flex-row items-center ms-auto -me-1.5 lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-[#636363] dark:text-[#9A9A9A] hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-b border-black/[0.04] dark:border-[#222] bg-white dark:bg-black px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-2 text-base font-medium text-[#636363] dark:text-[#9A9A9A] hover:text-black dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-black/[0.04] dark:border-[#222] flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center rounded-full border border-black/[0.04] dark:border-[#333] p-1 overflow-hidden"
                aria-label="Toggle Theme"
              >
                <Sun className={`size-7 p-1.5 text-[#636363] dark:text-accent rounded-full ${theme === "dark" ? "" : "bg-accent/10"}`} />
                <Moon className={`size-7 p-1.5 text-accent dark:text-[#636363] rounded-full ${theme === "dark" ? "bg-accent/10" : ""}`} />
              </button>
              <a
                href="https://github.com/yasasbanukaofficial/curo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-1.5 text-[#636363] dark:text-[#9A9A9A] hover:text-black dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
            </div>
            <a href="/login" onClick={() => setIsOpen(false)} className="text-center py-2 text-base font-medium text-[#636363] dark:text-[#9A9A9A]">
              Sign In
            </a>
            <Button variant="secondary" href="/register" onClick={() => setIsOpen(false)} className="w-full text-base font-medium" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
