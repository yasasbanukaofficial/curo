import { useState, useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Corner from "./Corner";
import CuroLogo from "./CuroLogo";
import NavLink from "./NavLink";
import { Button } from "../ui/Button";
import { MenuIcon, CloseIcon } from "../ui/Icons";

const links = [
  { href: "#features", label: "Features" },
  { href: "#problem", label: "Problem" },
  { href: "#centralized", label: "System" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastScroll.current;
    if (delta > 15) {
      setHidden(true);
    } else if (delta < -15) {
      setHidden(false);
    }
    lastScroll.current = y;
  });

  useEffect(() => {
    lastScroll.current = 0;
  }, []);

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full bg-[#fcfcfc] pt-5"
      animate={{ y: hidden ? -88 : 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
    >
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center border-b border-[#efefef]">
          <div className="flex-1 flex items-center">
            <CuroLogo />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="hidden md:flex items-center gap-4">
              <a href="/login" className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors">Sign In</a>
              <Button variant="secondary" href="#pricing" size="sm">Get Started</Button>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-[#191919] hover:text-[#636363] focus:outline-none">
                {isOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
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
            <Button variant="secondary" href="#pricing" onClick={() => setIsOpen(false)} className="w-full text-base font-medium" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
