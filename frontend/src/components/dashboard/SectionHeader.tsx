interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-black dark:text-white">{title}</h2>
      {description && (
        <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">{description}</p>
      )}
    </div>
  );
}
