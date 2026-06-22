interface NavLinkProps {
  href: string;
  children: string;
  mobile?: boolean;
  onClick?: () => void;
}

export default function NavLink({ href, children, mobile = false, onClick }: NavLinkProps) {
  if (mobile) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="block py-2 text-base font-medium text-[#636363] hover:text-[#191919]"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="text-sm font-medium text-[#636363] hover:text-[#191919] transition-colors"
    >
      {children}
    </a>
  );
}
