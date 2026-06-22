import { useState } from "react";
import Corner from "./Corner";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fcfcfc]">
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative mt-5">
        <div className="flex h-16 justify-between items-center border-b border-[#efefef]">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#191919] font-display">
              <svg className="h-6 w-6 text-[#191919]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 14.5v2" />
              </svg>
              <span>Curo</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Features</a>
              <a href="#problem" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Problem</a>
              <a href="#centralized" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">System</a>
              <a href="#integrations" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Integrations</a>
              <a href="#pricing" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Pricing</a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Sign In</a>
            <a href="#pricing" className="rounded-full bg-[#191919] px-4 py-2 text-sm font-medium text-white hover:bg-[#191919]/90 transition-all shadow-sm active:scale-95">
              Get Started
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#191919] hover:text-[#636363] focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <Corner />
      </div>
      {isOpen && (
        <div className="md:hidden border-b border-[#efefef] bg-[#fcfcfc] px-4 pt-2 pb-4 space-y-2">
          <a href="#features" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#636363] hover:text-[#191919]">Features</a>
          <a href="#problem" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#636363] hover:text-[#191919]">Problem</a>
          <a href="#centralized" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#636363] hover:text-[#191919]">System</a>
          <a href="#integrations" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#636363] hover:text-[#191919]">Integrations</a>
          <a href="#pricing" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#636363] hover:text-[#191919]">Pricing</a>
          <div className="pt-4 border-t border-[#efefef] flex flex-col gap-2">
            <a href="/login" onClick={() => setIsOpen(false)} className="text-center py-2 text-base font-medium text-[#636363]">Sign In</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="block text-center rounded-full bg-[#191919] py-2 text-base font-medium text-white hover:bg-[#191919]/90">
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
