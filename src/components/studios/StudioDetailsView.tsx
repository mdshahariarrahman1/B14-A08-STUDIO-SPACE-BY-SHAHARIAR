import Link from "next/link";
import {
  CircleCheck,
  Clock,
  DoorOpen,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import StudioImage from "@/components/studios/StudioImage";
import WishlistButton from "@/components/studios/WishlistButton";
import { normalizeStudioCategory } from "@/lib/studios";
import type { IStudio } from "@/type";
import BookingWidget from "./BookingWidget";

const AMENITY_STYLES: Record<string, { icon: LucideIcon; chip: string }> = {
  "professional lighting": { icon: Sun, chip: "bg-amber-100 text-amber-700" },
  lighting: { icon: Sun, chip: "bg-amber-100 text-amber-700" },
  "changing room": { icon: DoorOpen, chip: "bg-sky-100 text-sky-700" },
  "makeup station": { icon: Sparkles, chip: "bg-purple-100 text-purple-700" },
  "air conditioning": { icon: Wind, chip: "bg-teal-100 text-teal-700" },
  "wi-fi": { icon: Wifi, chip: "bg-amber-100 text-amber-700" },
  wifi: { icon: Wifi, chip: "bg-amber-100 text-amber-700" },
};

const AMENITY_FALLBACK = {
  icon: CircleCheck,
  chip: "bg-neutral-100 text-neutral-700",
};

function getAmenityStyle(amenity: string) {
  return AMENITY_STYLES[normalizeStudioCategory(amenity)] ?? AMENITY_FALLBACK;
}

function splitTitleForDisplay(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) {
    return { lead: title.trim(), accent: "" };
  }

  return {
    lead: words.slice(0, -2).join(" "),
    accent: words.slice(-2).join(" "),
  };
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials || "SA";
}

const SectionHeading = ({ pre, accent }: { pre: string; accent?: string }) => (
  <h2 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
    {pre}
    {accent ? (
      <span className="ml-2 font-serif font-normal italic text-[#8a6a4f]">
        {accent}
      </span>
    ) : null}
  </h2>
);

const StudioDetailsView = ({ studio }: { studio: IStudio }) => {
  const { lead, accent } = splitTitleForDisplay(studio.title);
  const amenities = Array.isArray(studio.amenities) ? studio.amenities : [];

  const statCards = [
    {
      icon: Clock,
      chip: "bg-amber-100 text-amber-700",
      value: `$${studio.hourlyRate}`,
      label: "Hourly rate",
    },
    {
      icon: Users,
      chip: "bg-sky-100 text-sky-700",
      value: `${studio.maxCapacity} people`,
      label: "Max capacity",
    },
    {
      icon: ShieldCheck,
      chip: "bg-emerald-100 text-emerald-700",
      value: `$${studio.securityDeposit}`,
      label: "Security deposit",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f5f0] pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
          <Link
            href="/studios"
            className="underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-800"
          >
            Spaces
          </Link>
          <span aria-hidden className="mx-1.5">
            /
          </span>
          <span className="text-neutral-600">{studio.category}</span>
        </nav>

        {/* Header */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
              <span aria-hidden className="text-[#C96F4A]">
                •
              </span>
              {studio.category}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              {lead}
              {accent ? (
                <span className="font-serif font-normal italic text-[#8a6a4f]">
                  {" "}
                  {accent}
                </span>
              ) : null}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <Star
                  aria-hidden
                  className="size-4 fill-amber-500 text-amber-500"
                />
                <span className="font-semibold text-neutral-900">
                  {studio.rating.toFixed(1)}
                </span>
                <span className="text-neutral-500">
                  ({studio.reviewCount} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600">
                <MapPin aria-hidden className="size-4" />
                {studio.location}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              studio.isAvailable
                ? "bg-emerald-100 text-emerald-800"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            <span
              aria-hidden
              className={`size-1.5 rounded-full ${
                studio.isAvailable ? "bg-emerald-600" : "bg-neutral-500"
              }`}
            />
            {studio.isAvailable ? "Available for booking" : "Unavailable"}
          </span>
        </div>

        {/* Hero image */}
        <div className="relative mt-6 h-72 overflow-hidden rounded-3xl bg-[#ded6c9] sm:h-96">
          <WishlistButton studioId={studio._id} studioTitle={studio.title} />
          <StudioImage
            src={studio.imageUrl}
            alt={studio.title}
            category={studio.category}
            sizes="(min-width: 1280px) 1152px, 100vw"
          />
        </div>

        {/* Body: content column + booking widget */}
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-14">
            {/* Quick facts */}
            <div className="grid gap-4 sm:grid-cols-3">
              {statCards.map((stat) => (
                <Card
                  key={stat.label}
                  size="sm"
                  className="rounded-2xl bg-white shadow-sm ring-black/8"
                >
                  <CardContent className="p-5">
                    <span
                      className={`flex size-10 items-center justify-center rounded-xl ${stat.chip}`}
                    >
                      <stat.icon aria-hidden className="size-5" />
                    </span>
                    <p className="mt-4 text-xl font-semibold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* About */}
            <section className="space-y-4">
              <SectionHeading pre="About this" accent="space" />
              <p className="max-w-2xl leading-7 text-neutral-600">
                {studio.overview}
              </p>
            </section>

            {/* What's included */}
            {amenities.length > 0 ? (
              <section className="space-y-5">
                <SectionHeading pre="What’s" accent="included" />
                <ul className="grid gap-3 sm:grid-cols-2">
                  {amenities.map((amenity) => {
                    const style = getAmenityStyle(amenity);
                    return (
                      <li key={amenity}>
                        <Card
                          size="sm"
                          className="rounded-2xl bg-white shadow-sm ring-black/8"
                        >
                          <CardContent className="flex items-center gap-3 p-3.5">
                            <span
                              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.chip}`}
                            >
                              <style.icon
                                aria-hidden
                                className="size-4.5"
                              />
                            </span>
                            <span className="truncate text-sm font-medium text-neutral-900">
                              {amenity}
                            </span>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {/* Host */}
            <section className="space-y-5">
              <SectionHeading pre="Your" accent="host" />
              <Card className="rounded-2xl bg-white py-0 shadow-sm ring-black/8">
                <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg" className="size-12">
                      <AvatarFallback className="bg-[#2b2118] text-sm font-semibold text-white">
                        {getInitials(studio.ownerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {studio.ownerName}
                      </p>
                      <p className="text-sm text-neutral-500">Studio owner</p>
                    </div>
                  </div>
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="h-10 rounded-xl px-4 text-sm font-medium"
                    render={
                      <a
                        href={`mailto:${studio.ownerEmail}?subject=${encodeURIComponent(
                          `Booking inquiry: ${studio.title}`,
                        )}`}
                      />
                    }
                  >
                    <Mail aria-hidden className="size-4" />
                    Contact host
                  </Button>
                </div>
              </Card>
            </section>

            {/* Rating */}
            <section className="space-y-5">
              <SectionHeading pre="Creator" accent="rating" />
              <Card className="rounded-2xl bg-white py-0 shadow-sm ring-black/8">
                <div className="flex items-center gap-6 p-6">
                  <span className="text-4xl font-semibold text-neutral-900">
                    {studio.rating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Star
                          key={index}
                          aria-hidden
                          className={`size-4 ${
                            index < Math.round(studio.rating)
                              ? "fill-amber-500 text-amber-500"
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">
                      Based on {studio.reviewCount} creator reviews
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Booking widget */}
          <BookingWidget studio={studio} />
        </div>
      </div>
    </main>
  );
};

export default StudioDetailsView;
