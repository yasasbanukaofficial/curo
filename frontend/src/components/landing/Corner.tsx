export default function Corner({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between ${className}`}>
      <div className="flex justify-between">
        <div className="h-3 w-3 border-t-2 border-l-2 border-[#191919]" />
        <div className="h-3 w-3 border-t-2 border-r-2 border-[#191919]" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-3 border-b-2 border-l-2 border-[#191919]" />
        <div className="h-3 w-3 border-b-2 border-r-2 border-[#191919]" />
      </div>
    </div>
  );
}
