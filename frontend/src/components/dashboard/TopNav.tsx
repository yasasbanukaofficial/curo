export default function TopNav() {
  return (
    <header className="flex items-center h-14 px-6 bg-white border-b border-[#EFEFEF]">
      <a href="/" className="flex items-center gap-2 font-medium text-sm text-[#1A1A1A]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 14.5v2" />
        </svg>
        Curo
      </a>
    </header>
  );
}
