interface BadgeProps {
  label: string;
  className?: string;
}

const envStyles: Record<string, string> = {
  production: "bg-[#FF3B30]/10 text-[#FF3B30]",
  staging: "bg-[#FF9F0A]/10 text-[#FF9F0A]",
  development: "bg-[#30D158]/10 text-[#30D158]",
};

const actionStyles: Record<string, string> = {
  created: "bg-[#30D158]/10 text-[#30D158]",
  updated: "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93]",
  rotated: "bg-[#FF9F0A]/10 text-[#FF9F0A]",
  deleted: "bg-[#FF3B30]/10 text-[#FF3B30]",
  synced: "bg-[#007AFF]/10 text-[#007AFF]",
  deployed: "bg-[#007AFF]/10 text-[#007AFF]",
  "granted access to": "bg-[#5E5CE6]/10 text-[#5E5CE6]",
  "revoked access to": "bg-[#FF3B30]/10 text-[#FF3B30]",
};

export function EnvBadge({ label, className = "" }: BadgeProps) {
  const style = envStyles[label.toLowerCase()] || "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93]";
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${style} ${className}`}>
      {label}
    </span>
  );
}

export function ActionBadge({ label, className = "" }: BadgeProps) {
  const style = actionStyles[label.toLowerCase()] || "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93]";
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${style} ${className}`}>
      {label}
    </span>
  );
}
