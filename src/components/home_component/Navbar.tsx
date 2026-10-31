"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NavLinks, { NAV_LINKS } from "./NavLinks";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const active = pathname === "/studios" ? "Explore Studios" : "Home";

  useEffect(() => {
    if (pathname !== "/" || window.location.hash !== "#how-it-works") {
      return;
    }

    let observer: MutationObserver | undefined;
    const scrollToHowItWorks = () => {
      const section = document.getElementById("how-it-works");
      if (!section) return false;

      section.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      observer?.disconnect();
      return true;
    };

    if (!scrollToHowItWorks()) {
      observer = new MutationObserver(scrollToHowItWorks);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    const timeout = window.setTimeout(() => observer?.disconnect(), 10000);
    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [pathname]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="20" fill="#F0A63C" />
            <path
              d="M8 24c3-9 10-15 24-17-6 2-9 5-11 9"
              stroke="#141414"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 31c7-1 14-7 17-16 1 4 0 9-3 13"
              stroke="#141414"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            StudioSpace
          </span>
        </Link>

        {/* Desktop navigation links */}
        <NavLinks active={active} onLinkClick={handleLinkClick} />

        {/* Auth buttons (desktop) + hamburger (mobile) */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="#"
              className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-800 transition-colors duration-200 hover:bg-neutral-50"
            >
              Login
            </Link>
            <Link
              href="#"
              className="rounded-xl bg-[#F0A63C] px-6 py-2.5 text-sm font-semibold text-[#141414] transition-colors duration-200 hover:bg-[#E2962B]"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-lg text-neutral-800 transition-colors hover:bg-neutral-100 md:hidden"
          >
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen ? (
        <nav className="border-t border-neutral-200 px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleLinkClick}
              aria-current={active === link.label ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active === link.label
                  ? "bg-amber-50 text-[#8A5A00]"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-3 border-t border-neutral-200 pt-3">
            <Link
              href="#"
              className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-center text-sm font-semibold text-neutral-800"
            >
              Login
            </Link>
            <Link
              href="#"
              className="flex-1 rounded-xl bg-[#F0A63C] px-4 py-2.5 text-center text-sm font-semibold text-[#141414]"
            >
              Register
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
};

export default Navbar;
