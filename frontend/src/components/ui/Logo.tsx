interface LogoProps {
  size?: "sm" | "md";
  className?: string;
}

const textSize = { sm: "text-2xl", md: "text-3xl" };

export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <a href="/" className={`flex items-center ${className}`}>
      <span className={`${textSize[size]} font-display tracking-wide`}>
        <span className="text-black dark:text-white">C</span>
        <span className="text-accent">U</span>
        <span className="text-black dark:text-white">R</span>
        <span className="text-accent">O</span>
      </span>
    </a>
  );
}
