export default function DotsLine({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1224 40"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ color: "rgb(221, 221, 221)" }}
      >
        <line
          x1="0"
          y1="20"
          x2="1224"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 12"
        />
      </svg>
    </div>
  );
}
