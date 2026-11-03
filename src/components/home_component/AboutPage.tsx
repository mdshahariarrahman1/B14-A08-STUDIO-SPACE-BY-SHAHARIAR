import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";

const PRINCIPLES = [
  {
    number: "01",
    title: "Clear and fair",
    description:
      "Rates, deposits and booking details are shown up front, so guests and hosts know what to expect.",
    color: "bg-[#eee0d0]",
    badge: "bg-[#fce7d0] text-[#a54c05]",
  },
  {
    number: "02",
    title: "Hosts first",
    description:
      "Every reservation is organized in one place, giving hosts more time to focus on their spaces.",
    color: "bg-[#dce9f4]",
    badge: "bg-white text-[#315d8a]",
  },
  {
    number: "03",
    title: "Made for makers",
    description:
      "The right room, at the right time, helps turn a good idea into something worth sharing.",
    color: "bg-[#deeee0]",
    badge: "bg-white text-[#287047]",
  },
] as const;

const STEPS = [
  {
    number: "1",
    title: "Find a space",
    description:
      "Browse studios by type, date and group size, then choose the one that fits.",
  },
  {
    number: "2",
    title: "Send a request",
    description:
      "Choose your hours and send a booking request. The host is notified right away.",
  },
  {
    number: "3",
    title: "Show up and create",
    description:
      "Once the host accepts, your booking is confirmed and the room is yours.",
  },
] as const;

const COMMUNITY = [
  {
    initials: "CR",
    name: "Creators",
    role: "Bring the ideas",
    color: "bg-[#fce7d0]",
  },
  {
    initials: "SH",
    name: "Studio hosts",
    role: "Share the spaces",
    color: "bg-[#dce9f4]",
  },
  {
    initials: "MA",
    name: "Makers",
    role: "Make the work",
    color: "bg-[#deeee0]",
  },
  {
    initials: "SS",
    name: "StudioSpace",
    role: "Bring it together",
    color: "bg-[#eee0d0]",
  },
] as const;

const AboutPage = () => (
  <main className="bg-[#f5f0e7] px-4 pb-8 text-[#2b1d12] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="pb-10 pt-8 sm:pb-14 sm:pt-10">
        <nav aria-label="Breadcrumb" className="text-xs text-[#76695d]">
          <Link className="hover:text-[#b94f08]" href="/studios">
            Spaces
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span aria-current="page">About us</span>
        </nav>

        <div className="mt-7 grid items-end gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Eyebrow>About us</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Spaces for people
              <br />
              who <em className="font-normal text-[#bf5109]">make things</em>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#6d5f52] sm:text-base sm:leading-7">
              We connect creators with beautiful, bookable studios, and give
              hosts one calm place to manage every reservation. Photographers,
              podcasters and musicians find the right room; hosts keep track of
              who is coming and what they will earn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end lg:pb-1">
            <Link
              href="/studios"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f5a000] px-5 text-sm font-semibold text-[#24180f] shadow-[0_8px_20px_rgba(217,133,0,0.2)] transition-colors hover:bg-[#e89400]"
            >
              <Plus aria-hidden className="size-4" />
              Browse spaces
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex h-11 items-center rounded-full border border-[#e4d9ca] bg-white px-5 text-sm font-semibold text-[#2b1d12] transition-colors hover:bg-[#fbf8f3]"
            >
              List your studio
            </Link>
          </div>
        </div>
      </header>

      <section aria-label="What StudioSpace offers" className="grid gap-3 sm:grid-cols-3">
        <Highlight
          icon={<CalendarDays aria-hidden className="size-4" />}
          color="bg-[#fce7d0] text-[#ac4b07]"
          title="Easy to book"
          detail="A clear path from search to reservation"
        />
        <Highlight
          icon={<Clock3 aria-hidden className="size-4" />}
          color="bg-[#dce9f4] text-[#315d8a]"
          title="By the hour"
          detail="Find the time and space that fits"
        />
        <Highlight
          icon={<CheckCircle2 aria-hidden className="size-4" />}
          color="bg-[#deeee0] text-[#287047]"
          title="Made together"
          detail="A better experience for guests and hosts"
        />
      </section>

      <section className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-3 max-w-xl font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-5xl">
            Good work needs the{" "}
            <em className="font-normal text-[#bf5109]">right room</em>
          </h2>
          <div className="mt-5 max-w-xl space-y-4 text-sm leading-6 text-[#6d5f52]">
            <p>
              Great ideas deserve more than a last-minute search for somewhere
              to work. We set out to make finding a well-equipped creative
              space feel simple, clear and welcoming.
            </p>
            <p>
              StudioSpace brings independent hosts and creators together.
              Guests can find a room that suits the project; hosts can share
              their space and manage requests without the back-and-forth.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["Photo studios", "bg-[#fce7d0] text-[#a54c05]"],
              ["Podcast lounges", "bg-[#dce9f4] text-[#315d8a]"],
              ["Music suites", "bg-[#deeee0] text-[#287047]"],
            ].map(([label, color]) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${color}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SpaceCard
            className="sm:col-span-2"
            category="Photo studio"
            title="Natural light, clean walls"
            description="Portraits, product shoots and small campaigns, by the hour."
            color="bg-[#eee0d0]"
          />
          <SpaceCard
            category="Podcast lounge"
            title="Quiet, treated, ready to record"
            description="A focused room for thoughtful conversations."
            color="bg-[#dce9f4]"
          />
          <SpaceCard
            category="Music suite"
            title="Room to rehearse and write"
            description="Space to find the rhythm and make it yours."
            color="bg-[#deeee0]"
          />
        </div>
      </section>

      <section className="py-5" aria-labelledby="beliefs-heading">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="beliefs-heading"
            className="font-serif text-4xl leading-none tracking-[-0.045em] sm:text-5xl"
          >
            What we <em className="font-normal text-[#bf5109]">believe</em>
          </h2>
          <span className="mb-1 rounded-full bg-[#fce7d0] px-3 py-1.5 text-xs font-medium text-[#a54c05]">
            3 principles
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.number}
              className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-black/5"
            >
              <div className={`min-h-28 rounded-2xl p-4 ${principle.color}`}>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${principle.badge}`}
                >
                  Principle {principle.number}
                </span>
                <h3 className="mt-2 font-serif text-2xl tracking-tight">
                  {principle.title}
                </h3>
              </div>
              <p className="px-1 pb-1 pt-3 text-xs leading-5 text-[#6d5f52]">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-9 sm:py-12" aria-labelledby="steps-heading">
        <h2
          id="steps-heading"
          className="font-serif text-4xl leading-none tracking-[-0.045em] sm:text-5xl"
        >
          How it <em className="font-normal text-[#bf5109]">works</em>
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6"
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#2b1d12] text-sm font-semibold text-white">
                {step.number}
              </span>
              <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#6d5f52]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-8 pt-1" aria-labelledby="community-heading">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="community-heading"
            className="font-serif text-4xl leading-none tracking-[-0.045em] sm:text-5xl"
          >
            The <em className="font-normal text-[#bf5109]">people</em> behind it
          </h2>
          <span className="mb-1 rounded-full bg-[#fce7d0] px-3 py-1.5 text-xs font-medium text-[#a54c05]">
            Our community
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COMMUNITY.map((member) => (
            <article
              key={member.name}
              className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5"
            >
              <span
                className={`grid size-10 place-items-center rounded-full text-xs font-semibold text-[#2b1d12] ${member.color}`}
              >
                {member.initials}
              </span>
              <h3 className="mt-3 text-sm font-semibold">{member.name}</h3>
              <p className="mt-1 text-xs text-[#796b5e]">{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-[#2b1d12] px-6 py-8 text-[#fbf7f0] sm:px-8 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div>
          <Eyebrow>Join us</Eyebrow>
          <h2 className="mt-2 font-serif text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">
            Have a studio? Let creators{" "}
            <em className="font-normal text-[#f5a000]">find it</em>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#d8cbbd]">
            List your space, set your hours and start receiving booking
            requests in one calm dashboard.
          </p>
        </div>
        <Link
          href="/add-studio"
          className="mt-6 inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#f5a000] px-5 text-sm font-semibold text-[#24180f] transition-colors hover:bg-[#e89400] lg:mt-0"
        >
          <Plus aria-hidden className="size-4" />
          List your studio
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </section>
    </div>
  </main>
);

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a64a09]">
      <span aria-hidden className="size-1 rounded-full bg-[#d47723]" />
      {children}
    </p>
  );
}

function Highlight({
  icon,
  color,
  title,
  detail,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  detail: string;
}) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
      <span className={`grid size-9 place-items-center rounded-xl ${color}`}>
        {icon}
      </span>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-[#796b5e]">{detail}</p>
    </article>
  );
}

function SpaceCard({
  category,
  title,
  description,
  color,
  className = "",
}: {
  category: string;
  title: string;
  description: string;
  color: string;
  className?: string;
}) {
  return (
    <article className={`rounded-3xl bg-white p-3 shadow-sm ring-1 ring-black/5 ${className}`}>
      <div className={`rounded-2xl p-4 sm:p-5 ${color}`}>
        <span className="inline-flex rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-[#664630]">
          {category}
        </span>
        <h3 className="mt-3 font-serif text-xl leading-tight tracking-tight sm:text-2xl">
          {title}
        </h3>
      </div>
      <p className="px-1 pb-1 pt-3 text-xs leading-5 text-[#796b5e]">
        {description}
      </p>
    </article>
  );
}

export default AboutPage;
