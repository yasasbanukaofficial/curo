import type { ReactNode } from "react";

interface MediaFrameProps {
  children: ReactNode;
  rounded?: string;
  shadow?: string;
  className?: string;
}

export default function MediaFrame({
  children,
  rounded = "rounded-xl",
  shadow = "shadow-sm",
  className = "",
}: MediaFrameProps) {
  return (
    <div
      className={`${rounded} border border-[#efefef] overflow-hidden bg-[#fcfcfc] ${shadow} ${className}`}
    >
      {children}
    </div>
  );
}
