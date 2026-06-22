import { useState } from "react";
import Corner from "./Corner";
import CuroLogo from "./CuroLogo";
import NavLink from "./NavLink";
import ButtonPrimary from "./ButtonPrimary";

const links = [
  { href: "#features", label: "Features" },
  { href: "#problem", label: "Problem" },
  { href: "#centralized", label: "System" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fcfcfc]">
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative mt-5">
        <div className="flex h-16 justify-between items-center border-b border-[#efefef]">
          <div className="flex items-center gap-8">
            <CuroLogo />
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Sign In</a>
            <ButtonPrimary href="#pricing" size="sm">Get Started</ButtonPrimary>
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
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} mobile onClick={() => setIsOpen(false)}>
              {link.label}
            </NavLink>
          ))}
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
