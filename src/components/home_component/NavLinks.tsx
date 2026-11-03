"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
];

type NavLinksProps = {
  active: string;
  onLinkClick: (label: string) => void;
};

const NavLinks = ({ active, onLinkClick }: NavLinksProps) => {
  return (
    <nav className="hidden self-stretch items-center md:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={() => onLinkClick(link.label)}
          aria-current={active === link.label ? "page" : undefined}
          className={cn(
            "relative flex h-full items-center px-5 text-base font-medium transition-colors duration-200",
            active === link.label
              ? "text-neutral-900"
              : "text-neutral-600 hover:text-neutral-900"
          )}
        >
          {link.label}
          {active === link.label ? (
            <span className="absolute inset-x-4 bottom-0 h-0.75 rounded-full bg-[#F0A63C]" />
          ) : null}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
