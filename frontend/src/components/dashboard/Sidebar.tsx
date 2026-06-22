const navItems = [
  { label: "Overview", icon: "grid", active: true },
  { label: "Documents", icon: "file", active: false },
  { label: "Brand Voice", icon: "sparkle", active: false },
  { label: "Terminology", icon: "table", active: false },
  { label: "Outputs", icon: "external", active: false },
  { label: "Settings", icon: "gear", active: false },
];

function NavIcon({ type }: { type: string }) {
  if (type === "grid") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
  if (type === "file") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
  if (type === "sparkle") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" /><circle cx="19" cy="19" r="2" /><circle cx="5" cy="19" r="2" />
    </svg>
  );
  if (type === "table") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
  if (type === "external") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
  if (type === "gear") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
  return null;
}

export default function Sidebar() {
  return (
    <aside className="w-[220px] bg-white border-r border-[#EFEFEF] flex flex-col flex-shrink-0">
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search anything"
            className="w-full h-9 pl-4 pr-10 text-sm bg-[#F5F5F5] rounded-lg border-none outline-none text-[#1A1A1A] placeholder-[#888]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#888] font-medium">⌘F</span>
        </div>
      </div>

      <div className="px-4 mb-2">
        <p className="text-[10px] font-medium text-[#888] tracking-[0.08em] uppercase">Main Menu</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 w-full h-9 px-3 text-sm rounded-lg transition-colors ${
              item.active
                ? "bg-[#F3F3F3] text-[#1A1A1A] font-medium"
                : "text-[#888] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
            }`}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 pb-4 mt-auto border-t border-[#EFEFEF] pt-4">
        <p className="text-[10px] font-medium text-[#888] tracking-[0.08em] uppercase mb-3">Mode</p>
        <div className="flex items-center bg-[#F5F5F5] rounded-lg p-0.5">
          <button className="flex-1 h-8 flex items-center justify-center gap-1.5 text-sm bg-white rounded-md shadow-sm font-medium text-[#1A1A1A]">
            <span>☀</span> Light
          </button>
          <button className="flex-1 h-8 flex items-center justify-center gap-1.5 text-sm text-[#888] hover:text-[#1A1A1A]">
            <span>🌙</span> Dark
          </button>
        </div>
      </div>
    </aside>
  );
}
