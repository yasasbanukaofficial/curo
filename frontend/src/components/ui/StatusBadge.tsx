interface StatusBadgeProps {
  status: string;
  className?: string;
}

const styles: Record<string, string> = {
  Compliant: "text-[#22C55E] bg-[#F0FDF4]",
  Review: "text-[#F59E0B] bg-[#FFFBEB]",
  Flagged: "text-[#EF4444] bg-[#FEF2F2]",
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${styles[status] || "text-[#888] bg-[#F5F5F5]"} ${className}`}>
      {status}
    </span>
  );
}
