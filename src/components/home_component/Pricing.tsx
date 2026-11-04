import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, Package } from "lucide-react";

const PLANS = [
  {
    name: "Hourly",
    icon: Clock,
    price: "$69",
    per: "hour",
    description: "Best for short shoots, pickups, and quick podcast sessions.",
    features: [
      "1-hour minimum",
      "All gear included",
      "On-site host",
      "Free Wi-Fi",
      "Basic setup support",
    ],
    featured: false,
  },
  {
    name: "Half-Day",
    icon: Calendar,
    price: "$249",
    per: "4 hours",
    description: "Ideal for full content sessions, brand shoots, and interviews.",
    features: [
      "4 hours included",
      "Priority booking",
      "Lighting assist",
      "Coffee bar access",
      "Locker storage",
    ],
    featured: true,
  },
  {
    name: "Full-Day",
    icon: Package,
    price: "$449",
    per: "8 hours",
    description: "For ambitious productions, multi-look shoots, and team days.",
    features: [
      "8 hours included",
      "Dedicated producer",
      "Backup gear access",
      "Catering options",
      "Loading dock access",
    ],
    featured: false,
  },
];

const Pricing = () => (
  <section
    aria-labelledby="pricing-heading"
    className="bg-card px-5 py-14 sm:px-8 sm:py-20"
  >
    <div className="mx-auto max-w-6xl">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#927d72] dark:text-[#a4987f]">
          <span aria-hidden>&bull; </span>Pricing
        </p>
        <h2
          id="pricing-heading"
          className="mt-3 text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl"
        >
          Transparent rates.
          <br />
          <span className="font-normal italic text-[#806049] dark:text-[#c8ab7f]">
            No hidden fees.
          </span>
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5 sm:p-8 sm:last:col-span-2 lg:last:col-span-1 ${
              plan.featured
                ? "bg-[#1A120B] text-white shadow-lg"
                : "bg-card shadow-sm ring-1 ring-black/8 hover:shadow-md"
            }`}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#A17A45] px-3 py-1 text-[10px] font-semibold text-[#1A120B] dark:text-[#f2eadf]">
                Best Value
              </span>
            ) : null}

            <div className="flex items-center gap-3.5">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                  plan.featured
                    ? "bg-[#A17A45] text-white"
                    : "bg-[#1A120B] text-white"
                }`}
              >
                <plan.icon className="size-4" />
              </span>
              <h3
                className={`text-lg font-semibold ${
                  plan.featured ? "text-white" : "text-foreground"
                }`}
              >
                {plan.name}
              </h3>
            </div>

            <p
              className={`mt-6 text-xs tracking-wide ${
                plan.featured ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              Starting from
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-5xl font-semibold tracking-tight ${
                  plan.featured ? "text-white" : "text-foreground"
                }`}
              >
                {plan.price}
              </span>
              <span
                className={`text-sm ${
                  plan.featured ? "text-white/60" : "text-muted-foreground"
                }`}
              >
                / {plan.per}
              </span>
            </p>

            <div
              aria-hidden
              className={`mt-6 border-t ${
                plan.featured ? "border-white/15" : "border-border"
              }`}
            />

            <p
              className={`mt-6 text-sm leading-6 ${
                plan.featured ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {plan.description}
            </p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-center gap-2.5 text-sm ${
                    plan.featured ? "text-white/90" : "text-foreground"
                  }`}
                >
                  <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#A17A45]">
                    <Check className="size-3 text-white" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <Button
                nativeButton={false}
                render={<Link href="/studios" />}
                variant="ghost"
                className={`mt-8 h-11 w-full rounded-full text-sm ${
                  plan.featured
                    ? "bg-card text-[#1A120B] dark:text-[#f2eadf] hover:bg-muted"
                    : "bg-[#1A120B] text-white hover:bg-[#33261b]"
                }`}
              >
                Reserve this plan
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
