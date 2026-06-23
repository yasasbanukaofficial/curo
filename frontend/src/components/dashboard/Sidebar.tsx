import { useTheme } from "../../contexts/ThemeContext";

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
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-[220px] bg-white dark:bg-[#1A1A1A] border-r border-[#EFEFEF] dark:border-[#2A2A2A] flex flex-col flex-shrink-0">
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search anything"
            className="w-full h-9 pl-4 pr-10 text-sm bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1A1A1A] dark:text-[#E5E5E5] placeholder-[#888] dark:placeholder-[#666]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#888] dark:text-[#666] font-medium">⌘F</span>
        </div>
      </div>

      <div className="px-4 mb-2">
        <p className="text-[10px] font-medium text-[#888] dark:text-[#666] tracking-[0.08em] uppercase">Main Menu</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 w-full h-9 px-3 text-sm rounded-lg transition-colors ${
              item.active
                ? "bg-[#F3F3F3] dark:bg-[#333] text-[#1A1A1A] dark:text-[#E5E5E5] font-medium"
                : "text-[#888] dark:text-[#666] hover:text-[#1A1A1A] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]"
            }`}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 pb-4 mt-auto border-t border-[#EFEFEF] dark:border-[#2A2A2A] pt-4">
        <p className="text-[10px] font-medium text-[#888] dark:text-[#666] tracking-[0.08em] uppercase mb-3">Mode</p>
        <div className="flex items-center bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-lg p-0.5">
          <button
            onClick={theme === "dark" ? toggle : undefined}
            className={`flex-1 h-10 flex items-center justify-center gap-1.5 text-sm rounded-md font-medium transition-colors ${
              theme === "light"
                ? "bg-white dark:bg-[#333] shadow-sm text-[#1A1A1A] dark:text-[#E5E5E5]"
                : "text-[#888] dark:text-[#666] hover:text-[#1A1A1A] dark:hover:text-[#E5E5E5]"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Light
          </button>
          <button
            onClick={theme === "light" ? toggle : undefined}
            className={`flex-1 h-10 flex items-center justify-center gap-1.5 text-sm rounded-md font-medium transition-colors ${
              theme === "dark"
                ? "bg-white dark:bg-[#333] shadow-sm text-[#1A1A1A] dark:text-[#E5E5E5]"
                : "text-[#888] dark:text-[#666] hover:text-[#1A1A1A] dark:hover:text-[#E5E5E5]"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark
          </button>
        </div>
      </div>
    </aside>
  );
}
