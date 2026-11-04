import Link from "next/link";
import type { Metadata } from "next";
import { House, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page not found | StudioSpace",
  description:
    "The page you are looking for has wrapped up, moved to another stage, or never made it to the call sheet.",
};

const QUICK_LINKS = [
  { label: "Photo Studio", href: "/studios?category=Photo%20Studio" },
  { label: "Podcast Lounge", href: "/studios?category=Podcast%20Lounge" },
  { label: "Film Stage", href: "/studios?category=Film%20Stage" },
  { label: "Music Suite", href: "/studios?category=Music%20Suite" },
] as const;

const SPARKLE =
  "M0 -11 C1.8 -5.4 3.4 -1.8 9 0 C3.4 1.8 1.8 5.4 0 11 C-1.8 5.4 -3.4 1.8 -9 0 C-3.4 -1.8 -1.8 -5.4 0 -11 Z";

function NotFoundIllustration() {
  return (
    <svg
      viewBox="0 0 680 480"
      role="img"
      aria-label="An empty film set: a studio light and a camera on tripods around a clapperboard reading 404"
      className="block h-auto w-full"
    >
      {/* Backdrop */}
      <rect width="680" height="480" fill="#cddceb" />

      {/* Light beam from the softbox onto the set */}
      <polygon
        points="240,190 640,108 668,322 250,312"
        fill="#dcded2"
        opacity="0.85"
      />

      {/* Studio floor */}
      <ellipse cx="340" cy="442" rx="322" ry="52" fill="#e9dcc4" />

      {/* Sparkles */}
      <path d={SPARKLE} transform="translate(104 80) scale(1.25)" fill="#f4b200" />
      <path d={SPARKLE} transform="translate(652 294) scale(0.9)" fill="#f4b200" />
      <path d={SPARKLE} transform="translate(612 42) scale(0.65)" fill="#fdfaf2" />

      {/* Softbox studio light */}
      <g>
        <path
          d="M185 400 L128 452"
          stroke="#2b2117"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M185 400 L242 452"
          stroke="#2b2117"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <rect x="180" y="244" width="10" height="166" rx="4" fill="#2b2117" />
        <rect x="120" y="118" width="130" height="134" rx="20" fill="#2b2117" />
        <rect x="133" y="131" width="104" height="108" rx="12" fill="#f7d05e" />
        <path
          d="M185 133 V 237"
          stroke="#e9b23f"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M135 185 H 235"
          stroke="#e9b23f"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* Camera on tripod */}
      <g>
        <path
          d="M542 306 L472 452"
          stroke="#2b2117"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M542 306 L612 452"
          stroke="#2b2117"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <rect x="534" y="256" width="16" height="58" rx="6" fill="#2b2117" />
        <rect x="472" y="146" width="62" height="32" rx="10" fill="#2b2117" />
        <rect x="455" y="168" width="170" height="96" rx="18" fill="#2b2117" />
        <circle cx="545" cy="216" r="36" fill="#faf6ec" />
        <circle cx="545" cy="216" r="22" fill="#f4a000" />
        <circle cx="545" cy="216" r="9" fill="#2b2117" />
        <circle cx="602" cy="186" r="8" fill="#df5044" />
      </g>

      {/* Clapperboard */}
      <g>
        <rect x="278" y="368" width="164" height="82" rx="12" fill="#2b2117" />
        <text
          x="360"
          y="428"
          textAnchor="middle"
          fontSize="56"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="2"
          fill="#f3ead2"
        >
          404
        </text>
        <g transform="rotate(-15 360 352)">
          <rect x="268" y="336" width="184" height="32" rx="7" fill="#f3ead2" />
          <rect x="274" y="339" width="22" height="26" rx="2" fill="#2b2117" />
          <rect x="314" y="339" width="22" height="26" rx="2" fill="#2b2117" />
          <rect x="354" y="339" width="22" height="26" rx="2" fill="#2b2117" />
          <rect x="394" y="339" width="22" height="26" rx="2" fill="#2b2117" />
          <rect x="434" y="339" width="22" height="26" rx="2" fill="#2b2117" />
        </g>
      </g>

      {/* Question speech bubble */}
      <g>
        <path d="M584 108 L564 134 L608 110 Z" fill="#fdfaf2" />
        <rect x="552" y="52" width="118" height="60" rx="20" fill="#fdfaf2" />
        <text
          x="594"
          y="98"
          fontSize="40"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fill="#c66b20"
        >
          ?
        </text>
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f7f3eb] dark:bg-[#14100c] px-5 py-12 sm:px-8 lg:py-16">
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <section className="flex flex-col items-start">
          <p className="flex items-center gap-2.5 text-xs font-bold tracking-[0.28em] text-[#c66b20] dark:text-[#f0a63c] uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-[#c66b20]" />
            Error 404
          </p>

          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[1.08] font-medium tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-6xl lg:text-7xl">
            This page is <em className="italic text-[#c66b20] dark:text-[#f0a63c]">off the set</em>
          </h1>

          <p className="mt-7 max-w-md text-base leading-7 text-[#62594e] dark:text-[#c9bda8] sm:text-lg sm:leading-8">
            The page you&apos;re looking for has wrapped up, moved to another
            stage, or never made it to the call sheet. Let&apos;s get you back
            to the main studio.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              className="h-12 rounded-full bg-[#f4a000] px-6 text-sm font-semibold text-[#201a14] dark:text-[#201a14] hover:bg-[#e89400]"
            >
              <House aria-hidden className="size-4" />
              Return to Home
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/studios" />}
              variant="outline"
              className="h-12 rounded-full border-[#e8e0d2] dark:border-[#33291d] bg-card px-6 text-sm font-semibold text-[#201a14] dark:text-[#f2eadf] hover:bg-[#faf6ec] dark:bg-[#1c1610]"
            >
              <Search aria-hidden className="size-4" />
              Browse studios
            </Button>
          </div>

          <p className="mt-9 text-sm text-[#8a7f70] dark:text-[#a4987f]">Or jump straight to</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {QUICK_LINKS.map((quickLink) => (
              <Button
                key={quickLink.label}
                nativeButton={false}
                render={<Link href={quickLink.href} />}
                variant="outline"
                className="h-10 rounded-full border-[#e8e0d2] dark:border-[#33291d] bg-card px-5 text-sm font-medium text-[#201a14] dark:text-[#f2eadf] shadow-sm hover:bg-[#faf6ec] dark:bg-[#1c1610]"
              >
                {quickLink.label}
              </Button>
            ))}
          </div>
        </section>

        <Card className="gap-0 rounded-[28px] bg-card py-0 shadow-[0_24px_50px_-28px_rgba(32,26,20,0.28)] ring-1 ring-black/5">
          <CardContent className="p-4">
            <div className="overflow-hidden rounded-2xl bg-[#cddceb] dark:bg-[#10283c]">
              <NotFoundIllustration />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between rounded-b-[28px] border-t border-[#f0e7d8] dark:border-[#33291d] bg-transparent px-6 py-5">
            <p className="text-sm text-[#62594e] dark:text-[#c9bda8] sm:text-base">
              Scene 4 · Take 0 · Page not found
            </p>
            <span className="flex items-center gap-2 rounded-full bg-[#fbe7ab] dark:bg-[#3a2a12] px-4 py-1.5 text-sm font-semibold text-[#201a14] dark:text-[#f5cf8d]">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-[#c66b20]"
              />
              404
            </span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}