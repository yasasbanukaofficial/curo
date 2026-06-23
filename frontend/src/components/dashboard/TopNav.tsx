import CuroLogo from "../landing/CuroLogo";

export default function TopNav() {
  return (
    <header className="flex items-center h-14 px-6 bg-white dark:bg-[#1A1A1A] border-b border-[#EFEFEF] dark:border-[#2A2A2A]">
      <CuroLogo size="sm" className="text-[#1A1A1A] dark:text-[#E5E5E5]" />
    </header>
  );
}
