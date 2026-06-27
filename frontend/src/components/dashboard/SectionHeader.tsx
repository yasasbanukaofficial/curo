interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{title}</h2>
      {description && (
        <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">{description}</p>
      )}
    </div>
  );
}
