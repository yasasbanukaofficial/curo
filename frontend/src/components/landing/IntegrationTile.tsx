import type { ReactNode } from "react";

interface IntegrationTileProps {
  name: string;
  icon: ReactNode;
}

export default function IntegrationTile({ name, icon }: IntegrationTileProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium text-[#737373]">{name}</span>
    </div>
  );
}
