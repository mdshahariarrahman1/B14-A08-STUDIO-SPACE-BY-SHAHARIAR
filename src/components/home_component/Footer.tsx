import Link from "next/link";
import { cacheLife } from "next/cache";
import FooterNewsletter from "./FooterNewsletter";

type SocialNetwork = "instagram" | "x" | "youtube" | "linkedin";

const POPULAR_CATEGORIES = [
  { label: "Photo Studio", href: "/studios?category=Photo%20Studio" },
  { label: "Podcast Lounge", href: "/studios?category=Podcast%20Lounge" },
  { label: "Film Stage", href: "/studios?category=Film%20Stage" },
  { label: "Music Suite", href: "/studios?category=Music%20Suite" },
  { label: "Workshop", href: "/studios?category=Workshop" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Spaces", href: "/studios" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Stories", href: "/#testimonials" },
  { label: "Log in", href: "#" },
  { label: "Register", href: "#" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    network: "instagram",
  },
  { label: "X", href: "https://x.com/", network: "x" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    network: "youtube",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    network: "linkedin",
  },
] satisfies { label: string; href: string; network: SocialNetwork }[];

const SocialIcon = ({ network }: { network: SocialNetwork }) => {
  if (network === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.901 1.153h3.68L14.54 11.31l9.45 12.856h-7.4l-5.8-7.585-6.64 7.585H.47l8.6-9.83L0 1.153h7.588l5.243 6.93zm-1.29 20.75h2.039L6.49 3.297H4.302z"
        />
      </svg>
    );
  }

  if (network === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (network === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V8.98h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.31ZM5.34 7.42a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.03H3.56V8.98h3.56v11.47ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.44c.98 0 1.79-.77 1.79-1.73V1.73C24 .77 23.19 0 22.22 0Z"
      />
    </svg>
  );
};

async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const Footer = async () => {
  const copyrightYear = await getCopyrightYear();

  return (
    <footer id="footer" className="scroll-mt-20 bg-[#1a120b] px-5 text-white sm:px-8">
    <div className="mx-auto max-w-7xl pt-12 pb-8 sm:pt-16">
      <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-[1.65fr_1fr_1fr_1fr] lg:gap-12">
        <div className="col-span-2 sm:col-span-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a000]"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="20" fill="#F0A000" />
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
            <span className="text-xl font-semibold tracking-tight text-white">
              StudioSpace
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-[1.9] text-[#d7ccc1]">
            Premium creative studios for photographers, podcasters, brands and
            the people shaping the next generation of culture.
          </p>
          <FooterNewsletter />
        </div>

        <nav aria-label="Popular studio categories">
          <h2 className="text-base font-semibold text-white">
            Popular studios
          </h2>
          <ul className="mt-5 space-y-3.5">
            {POPULAR_CATEGORIES.map((category) => (
              <li key={category.label}>
                <Link
                  href={category.href}
                  className="text-sm text-[#d7ccc1] transition-colors hover:text-[#f5a000]"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Quick links">
          <h2 className="text-base font-semibold text-white">Quick links</h2>
          <ul className="mt-5 space-y-3.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#d7ccc1] transition-colors hover:text-[#f5a000]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 sm:col-span-1">
          <h2 className="text-base font-semibold text-white">Follow us</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(({ label, href, network }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/4 text-white/90 transition-colors hover:border-[#f5a000]/50 hover:bg-[#f5a000]/10 hover:text-[#f5a000]"
                >
                  <SocialIcon network={network} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 sm:mt-14 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <p className="text-xs leading-5 text-[#cbbdaf] sm:text-sm">
          © {copyrightYear} StudioSpace. All rights reserved.
        </p>
        <nav
          aria-label="Legal links"
          className="mt-4 flex flex-wrap gap-x-6 gap-y-2 sm:mt-0"
        >
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="text-xs text-[#cbbdaf] transition-colors hover:text-[#f5a000] sm:text-sm"
              >
                {label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </div>
    </footer>
  );
};

export default Footer;
