interface CuroLogoProps {
  color?: string;
  size?: "sm" | "md";
  className?: string;
}

const textSize = { sm: "text-lg", md: "text-xl" };

export default function CuroLogo({ color = "text-[#191919]", size = "md", className = "" }: CuroLogoProps) {
  return (
    <a href="#" className={`flex items-center gap-2 ${textSize[size]} font-bold tracking-tight ${color} font-display ${className}`}>
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 14.5v2" />
      </svg>
      <span>Curo</span>
    </a>
  );
}
