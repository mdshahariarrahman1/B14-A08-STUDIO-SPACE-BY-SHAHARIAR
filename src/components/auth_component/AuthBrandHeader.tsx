import Link from "next/link";

const AuthBrandHeader = () => {
  return (
    <header>
      <Link href="/" className="inline-flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#141414]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
            <circle cx="12" cy="12" r="3.8" />
            <circle cx="16.8" cy="7.2" r="0.4" fill="#ffffff" />
          </svg>
        </span>
        <span className="text-xl font-bold tracking-tight text-[#141414] dark:text-[#f2eadf]">
          StudioSpace
        </span>
      </Link>
    </header>
  );
};

export default AuthBrandHeader;
