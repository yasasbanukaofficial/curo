interface CuroLogoProps {
  size?: "sm" | "md";
  className?: string;
  dark?: boolean;
}

const textSize = { sm: "text-2xl", md: "text-3xl" };

export default function CuroLogo({ size = "md", className = "", dark: forceDark = false }: CuroLogoProps) {
  return (
    <a href="/" className={`flex items-center ${className}`}>
      <span
        className={`${textSize[size]} font-display tracking-wide ${
          forceDark ? "text-white" : "text-black dark:text-white"
        }`}
      >
        CURO
      </span>
    </a>
  );
}
