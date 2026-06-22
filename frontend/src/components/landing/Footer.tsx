import CuroLogo from "./CuroLogo";
import { FacebookIcon, TwitterIcon, GitHubIcon, LinkedInIcon } from "../ui/Icons";

const sections = [
  { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Documentation", "API Reference", "Help Center", "Status"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
];

export default function Footer() {
  return (
    <footer className="bg-[#191919] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <CuroLogo color="text-white" size="sm" className="mb-4" />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Centralized secrets management for teams that need secure, consistent environment variables at scale.
            </p>
          </div>
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Curo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/40 hover:text-white/70 transition-colors"><FacebookIcon /></a>
            <a href="#" className="text-white/40 hover:text-white/70 transition-colors"><TwitterIcon /></a>
            <a href="#" className="text-white/40 hover:text-white/70 transition-colors"><GitHubIcon /></a>
            <a href="#" className="text-white/40 hover:text-white/70 transition-colors"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
