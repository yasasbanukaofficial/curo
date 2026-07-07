interface CuroLogoProps {
  size?: "sm" | "md";
  className?: string;
}

const imgSize = { sm: "h-28", md: "h-30" };

export default function CuroLogo({ size = "md", className = "" }: CuroLogoProps) {
  return (
    <a href="/" className={`flex items-center ${className}`}>
      <img src="/Light_Mode-removebg-preview.png" alt="Curo" className={`${imgSize[size]} block dark:hidden`} />
      <img src="/Dark_Mode-removebg.png" alt="Curo" className={`${imgSize[size]} hidden dark:block`} />
    </a>
  );
}
