import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FolderKanban, KeyRound, Layers3, Users, PlugZap, ScrollText, Search } from "lucide-react";
import DashboardButton from "./DashboardButton";
import SearchInput from "./SearchInput";
import CuroLogo from "../landing/CuroLogo";

interface SearchResult {
  id: string;
  label: string;
  description: string;
  category: "project" | "secret" | "environment" | "team" | "integration" | "audit";
  path: string;
}

interface FlatResult {
  category: string;
  item: SearchResult;
}

const searchData: SearchResult[] = [];

const categoryIcons: Record<string, typeof FolderKanban> = {
  project: FolderKanban,
  secret: KeyRound,
  environment: Layers3,
  team: Users,
  integration: PlugZap,
  audit: ScrollText,
};

const categoryLabels: Record<string, string> = {
  project: "Projects",
  secret: "Secrets",
  environment: "Environments",
  team: "Teams",
  integration: "Integrations",
  audit: "Audit Logs",
};

export default function TopNav() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setFocused(false);
        setSelectedIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = search.toLowerCase().trim();
  const results = query
    ? searchData.filter((r) =>
        r.label.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
      )
    : [];

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const flatResults = useMemo(() => {
    const flat: FlatResult[] = [];
    for (const [category, items] of Object.entries(grouped)) {
      for (const item of items) {
        flat.push({ category, item });
      }
    }
    return flat;
  }, [grouped]);

  const hasResults = results.length > 0;

  const executeItem = useCallback((index: number) => {
    const entry = flatResults[index];
    if (!entry) return;
    setSearch("");
    setFocused(false);
    setSelectedIndex(null);
    navigate(entry.item.path);
  }, [flatResults, navigate]);

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (!focused || !hasResults) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev === null ? 0 : Math.min(prev + 1, flatResults.length - 1);
        itemRefs.current[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (prev === null || prev <= 0) {
          itemRefs.current[flatResults.length - 1]?.scrollIntoView({ block: "nearest" });
          return flatResults.length - 1;
        }
        itemRefs.current[prev - 1]?.scrollIntoView({ block: "nearest" });
        return prev - 1;
      });
    } else if (e.key === "Enter" && selectedIndex !== null) {
      e.preventDefault();
      executeItem(selectedIndex);
    } else if (e.key === "Escape") {
      setFocused(false);
      setSelectedIndex(null);
      inputRef.current?.blur();
    }
  }

  return (
    <header className="relative z-50 flex items-center h-16 px-4 md:px-6 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-[#222] transition-colors duration-200">
      <div className="flex items-center">
        <CuroLogo size="sm" />
      </div>

      <div className="flex-1 flex justify-center px-3">
        <div className="relative flex-1 max-w-md">
          <SearchInput
            ref={inputRef}
            value={search}
            onChange={(v) => { setSearch(v); setSelectedIndex(null); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => { setFocused(false); setSelectedIndex(null); }, 200)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search secrets, projects, integrations..."
            shortcutKey="F"
          />

          {focused && search.trim() && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-2 z-50 max-h-[400px] overflow-y-auto"
            >
              {hasResults ? (
                (() => {
                  let globalIdx = -1;
                  return Object.entries(grouped).map(([category, items]) => {
                    const Icon = categoryIcons[category] || Search;
                    return (
                      <div key={category}>
                        <div className="px-3 py-1.5 text-[10px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide uppercase">
                          {categoryLabels[category] || category}
                        </div>
                        {items.map((item) => {
                          globalIdx++;
                          const idx = globalIdx;
                          const isSelected = selectedIndex === idx;
                          return (
                            <button
                              key={item.id}
                              ref={(el) => { itemRefs.current[idx] = el; }}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => { setSearch(""); setFocused(false); setSelectedIndex(null); navigate(item.path); }}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`flex items-center gap-3 w-full px-3 py-2 text-left transition-colors duration-150 ${
                                isSelected
                                  ? "bg-[#F5F5F7] dark:bg-[#333]"
                                  : "hover:bg-[#F5F5F7] dark:hover:bg-[#333]"
                              }`}
                            >
                              <div className="w-7 h-7 rounded-lg bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-[#8E8E93]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{item.label}</p>
                                <p className="text-[11px] text-[#8E8E93] dark:text-[#666] truncate">{item.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="px-3 py-4 text-center text-sm text-[#8E8E93] dark:text-[#666]">
                  No results found for "<span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{search}</span>"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <DashboardButton className="relative w-9 h-9 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#FF3B30] rounded-full" />
        </DashboardButton>
      </div>
    </header>
  );
}
