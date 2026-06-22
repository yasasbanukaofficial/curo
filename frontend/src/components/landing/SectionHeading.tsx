interface SectionHeadingProps {
  heading: string;
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  maxWidth?: string;
  marginBottom?: string;
}

export default function SectionHeading({
  heading,
  subtitle,
  as: Tag = "h2",
  maxWidth = "max-w-3xl",
  marginBottom = "mb-16 lg:mb-20",
}: SectionHeadingProps) {
  const headingSize =
    Tag === "h1"
      ? "text-4xl sm:text-5xl lg:text-6xl"
      : "text-3xl sm:text-4xl";

  return (
    <div className={`text-center ${maxWidth} mx-auto ${marginBottom}`}>
      <Tag
        className={`${headingSize} font-bold tracking-tight text-[#191919] font-display mb-4`}
      >
        {heading}
      </Tag>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
