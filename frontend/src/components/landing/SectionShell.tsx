import type { ReactNode } from "react";
import DotsLine from "./DotsLine";
import Corner from "./Corner";

interface SectionShellProps {
  children: ReactNode;
  id?: string;
  padding?: string;
  borderBottom?: boolean;
  className?: string;
}

export default function SectionShell({
  children,
  id,
  padding = "py-20 lg:py-28",
  borderBottom = false,
  className = "",
}: SectionShellProps) {
  return (
    <section id={id} className={`bg-[#fcfcfc] ${className}`}>
      <DotsLine className="h-10" />
      <div
        className={`border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${padding} relative`}
      >
        <Corner />
        {children}
      </div>
      {borderBottom && <div className="border-b border-[#efefef]" />}
      <DotsLine className="h-10" />
    </section>
  );
}
