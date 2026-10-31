import Link from "next/link";
import { ArrowRight, CalendarClock, Search, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import HowItWorksStep from "./HowItWorksStep";

const STEPS = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Find verified studios by location, equipment, and creator reviews. Explore spaces made for your kind of work.",
    icon: Search,
    iconClassName: "bg-[#fff0d9] text-[#ae6700]",
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Check availability, choose the hours that work for you, and review clear pricing before you book.",
    icon: CalendarClock,
    iconClassName: "bg-[#e2f2fa] text-[#2d7395]",
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Confirm your reservation in a few clicks, with booking details ready to share with your crew.",
    icon: Zap,
    iconClassName: "bg-[#e2f3e8] text-[#398052]",
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Arrive at your studio, get set up, and bring your next creative idea to life.",
    icon: Sparkles,
    iconClassName: "bg-[#f0e7f8] text-[#79549b]",
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    aria-labelledby="how-it-works-heading"
    className="scroll-mt-20 bg-[#f7f5f0] px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
  >
    <div className="mx-auto max-w-5xl">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b77717]">
          <span aria-hidden>• </span>Frictionless booking
        </p>
        <h2
          id="how-it-works-heading"
          className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-neutral-950 sm:text-5xl"
        >
          How StudioSpace{" "}
          <span className="font-normal italic text-[#806049]">works.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
          Four simple steps from your first idea to your next great creative
          project.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <HowItWorksStep key={step.number} {...step} />
        ))}
      </div>

      <div className="mt-9 flex justify-center sm:mt-11">
        <Button
          nativeButton={false}
          render={<Link href="/studios" />}
          className="h-12 rounded-xl bg-[#6F4E37]/95 px-6 text-sm font-semibold text-[#ffffff] shadow-[0_8px_18px_rgba(245,160,0,0.22)] transition hover:bg-[#6F4E37]/85 hover:shadow-[0_10px_22px_rgba(245,160,0,0.28)]"
        >
          Start exploring workspaces
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  </section>
);

export default HowItWorks;
