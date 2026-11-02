"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Link2,
  LockKeyhole,
  MapPin,
  Plus,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STUDIO_AMENITIES, STUDIO_CATEGORIES } from "@/lib/studio-options";
import StudioImage from "@/components/studios/StudioImage";
import type { IStudio } from "@/type";

type StudioOwner = {
  name: string;
  email: string;
};

const sectionClass =
  "rounded-2xl border border-[#eee7dc] bg-white p-5 shadow-sm sm:p-6";
const fieldClass =
  "grid gap-2 text-xs font-medium text-[#2e281f]";
const inputClass =
  "h-10 rounded-lg border-[#e7dfd4] bg-white px-3 text-sm placeholder:text-[#aaa197] focus-visible:border-[#d58821] focus-visible:ring-[#f7dfb3]";

const AddStudioForm = ({
  owner,
  studio,
}: {
  owner: StudioOwner;
  studio?: IStudio;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(studio?.title ?? "");
  const [category, setCategory] =
    useState<(typeof STUDIO_CATEGORIES)[number]>(() =>
      STUDIO_CATEGORIES.find((item) => item === studio?.category) ?? "Photo Studio",
    );
  const [hourlyRate, setHourlyRate] = useState(String(studio?.hourlyRate ?? 35));
  const [securityDeposit, setSecurityDeposit] = useState(
    String(studio?.securityDeposit ?? 100),
  );
  const [maxCapacity, setMaxCapacity] = useState(
    String(studio?.maxCapacity ?? 8),
  );
  const [rating, setRating] = useState(String(studio?.rating ?? 0));
  const [location, setLocation] = useState(studio?.location ?? "");
  const [imageUrl, setImageUrl] = useState(studio?.imageUrl ?? "");
  const [amenities, setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const [overview, setOverview] = useState(studio?.overview ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        studio
          ? `/api/studios/${encodeURIComponent(studio._id)}`
          : "/api/studios",
        {
        method: studio ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit),
          maxCapacity: Number(maxCapacity),
          rating: Number(rating),
          location,
          imageUrl,
          amenities,
          overview,
        }),
      });

      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : `Could not ${studio ? "update" : "publish"} your studio. Please try again.`;
        throw new Error(message);
      }

      setShowSuccessToast(true);
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      router.push("/my-listings");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Could not ${studio ? "update" : "publish"} your studio. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f3eb] pb-16">
      <div className="mx-auto max-w-6xl px-5 pt-7 sm:px-8 sm:pt-9">
        <nav aria-label="Breadcrumb" className="text-xs text-[#756b5e]">
          <Link className="underline underline-offset-2 hover:text-[#201a14]" href="/studios">
            Spaces
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <Link className="underline underline-offset-2 hover:text-[#201a14]" href="/my-listings">
            My listings
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span>{studio ? "Edit studio" : "Add new studio"}</span>
        </nav>

        <div className="mt-7 max-w-2xl">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c66b20]">
            <span aria-hidden className="size-1.5 rounded-full bg-[#d7831e]" />
            {studio ? "Edit listing" : "New listing"}
          </p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-[#201a14] sm:text-5xl">
            {studio ? "Update your " : "List your "}
            <span className="font-serif italic text-[#c66b20]">studio</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#62594e]">
            {studio
              ? "Update the details creators see when they discover your space."
              : "Tell creators what makes your space special. Add the essentials below, and your listing goes live as soon as you publish."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]"
        >
          <div className="space-y-4">
            <section aria-labelledby="basic-details" className={sectionClass}>
              <SectionTitle number="1" id="basic-details" lead="Basic" accent="details" />
              <div className="mt-5 grid gap-4">
                <label className={fieldClass} htmlFor="studio-title">
                  Studio title <RequiredMark />
                  <Input
                    id="studio-title"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Urban Light Photography Studio"
                    maxLength={120}
                    required
                    className={inputClass}
                  />
                </label>
                <label className={fieldClass} htmlFor="studio-category">
                  Category <RequiredMark />
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      if (value) {
                        setCategory(value as (typeof STUDIO_CATEGORIES)[number]);
                      }
                    }}
                  >
                    <SelectTrigger id="studio-category" className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDIO_CATEGORIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>
            </section>

            <section aria-labelledby="pricing-capacity" className={sectionClass}>
              <SectionTitle number="2" id="pricing-capacity" lead="Pricing &" accent="capacity" />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <label className={fieldClass} htmlFor="hourly-rate">
                  Hourly rate <RequiredMark />
                  <Input
                    id="hourly-rate"
                    name="hourlyRate"
                    type="number"
                    min="1"
                    step="1"
                    value={hourlyRate}
                    onChange={(event) => setHourlyRate(event.target.value)}
                    required
                    className={inputClass}
                  />
                  <span className="-mt-1 text-[10px] font-normal text-[#887e71]">USD / hour</span>
                </label>
                <label className={fieldClass} htmlFor="security-deposit">
                  Security deposit <RequiredMark />
                  <Input
                    id="security-deposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    step="1"
                    value={securityDeposit}
                    onChange={(event) => setSecurityDeposit(event.target.value)}
                    required
                    className={inputClass}
                  />
                  <span className="-mt-1 text-[10px] font-normal text-[#887e71]">USD</span>
                </label>
                <label className={fieldClass} htmlFor="max-capacity">
                  Max capacity <RequiredMark />
                  <Input
                    id="max-capacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    step="1"
                    value={maxCapacity}
                    onChange={(event) => setMaxCapacity(event.target.value)}
                    required
                    className={inputClass}
                  />
                  <span className="-mt-1 text-[10px] font-normal text-[#887e71]">People</span>
                </label>
              </div>
            </section>

            <section aria-labelledby="location-photo" className={sectionClass}>
              <SectionTitle number="3" id="location-photo" lead="Location &" accent="photo" />
              <div className="mt-5 grid gap-4">
                <label className={fieldClass} htmlFor="studio-location">
                  Location / address <RequiredMark />
                  <span className="relative">
                    <MapPin aria-hidden className="absolute left-3 top-3 size-4 text-[#8c8173]" />
                    <Input
                      id="studio-location"
                      name="location"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Street, area, city"
                      required
                      className={`${inputClass} pl-9`}
                    />
                  </span>
                </label>
                <label className={fieldClass} htmlFor="studio-image">
                  Image URL <RequiredMark />
                  <span className="relative">
                    <Link2 aria-hidden className="absolute left-3 top-3 size-4 text-[#8c8173]" />
                    <Input
                      id="studio-image"
                      name="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="https://"
                      required
                      className={`${inputClass} pl-9`}
                    />
                  </span>
                  <span className="-mt-1 text-[10px] font-normal text-[#887e71]">
                    Use a bright, landscape photo. It becomes the hero image on your listing.
                  </span>
                </label>
              </div>
            </section>

            <section aria-labelledby="included-amenities" className={sectionClass}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionTitle number="4" id="included-amenities" lead="What’s" accent="included" />
                <span className="rounded-full bg-[#fff0d9] px-3 py-1 text-[10px] font-medium text-[#8c571a]">
                  {amenities.length} selected
                </span>
              </div>
              <p className="mt-4 text-xs text-[#756b5e]">
                Tap to select everything guests can use during a booking.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {STUDIO_AMENITIES.map((amenity) => {
                  const selected = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleAmenity(amenity)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c66b20] ${
                        selected
                          ? "border-[#e8b66d] bg-[#fff1d9] text-[#70410c]"
                          : "border-[#e7dfd4] bg-white text-[#40382f] hover:bg-[#faf7f1]"
                      }`}
                    >
                      {selected ? <Check aria-hidden className="size-3" /> : <Plus aria-hidden className="size-3" />}
                      {amenity}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6">
                <h3 className="font-serif text-2xl tracking-tight text-[#201a14]">
                  Creator <span className="italic text-[#a06a3b]">rating</span>
                </h3>
                <div className="mt-4 flex min-h-22.5 flex-wrap items-center gap-5 rounded-2xl border border-[#dedbd5] bg-white px-5 py-4 shadow-sm">
                  <label className="grid gap-1.5 text-xs font-medium text-[#2e281f]" htmlFor="creator-rating">
                    Rating <span className="text-[10px] font-normal text-[#887e71]">out of 5</span>
                    <Input
                      id="creator-rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                      required
                      className={`${inputClass} w-24 font-serif text-2xl font-semibold`}
                    />
                  </label>
                  <div>
                    <div aria-hidden className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`size-4 ${
                            index < Math.round(Number(rating))
                              ? "fill-[#f4a000] text-[#f4a000]"
                              : "text-[#d8d1c7]"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-[#62594e]">
                      {studio ? "Ratings are managed from guest reviews" : "Set your creator rating"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="studio-overview" className={sectionClass}>
              <SectionTitle number="5" id="studio-overview" lead="About this" accent="space" />
              <label className={`${fieldClass} mt-5`} htmlFor="studio-overview-input">
                Detailed overview <RequiredMark />
                <textarea
                  id="studio-overview-input"
                  name="overview"
                  value={overview}
                  onChange={(event) => setOverview(event.target.value)}
                  placeholder="Describe the lighting, the vibe, what kinds of shoots it suits and any house rules."
                  rows={5}
                  maxLength={4000}
                  required
                  className="w-full resize-y rounded-lg border border-[#e7dfd4] bg-white px-3 py-3 text-sm font-normal leading-6 outline-none placeholder:text-[#aaa197] focus-visible:border-[#d58821] focus-visible:ring-3 focus-visible:ring-[#f7dfb3]"
                />
              </label>
            </section>

            <section aria-labelledby="host-details" className={sectionClass}>
              <SectionTitle number="6" id="host-details" lead="Your" accent="host details" />
              <p className="mt-3 text-xs text-[#756b5e]">
                Taken from your account, so guests know who they’re booking with.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={fieldClass} htmlFor="owner-name">
                  Name
                  <span className="relative">
                    <LockKeyhole aria-hidden className="absolute left-3 top-3 size-3.5 text-[#8c8173]" />
                    <Input id="owner-name" value={owner.name} readOnly className={`${inputClass} bg-[#f7f3eb] pl-9`} />
                  </span>
                </label>
                <label className={fieldClass} htmlFor="owner-email">
                  Email
                  <span className="relative">
                    <LockKeyhole aria-hidden className="absolute left-3 top-3 size-3.5 text-[#8c8173]" />
                    <Input id="owner-email" type="email" value={owner.email} readOnly className={`${inputClass} bg-[#f7f3eb] pl-9`} />
                  </span>
                </label>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <section className="rounded-2xl border border-[#eee7dc] bg-white p-5 shadow-[0_16px_40px_rgba(47,35,20,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c66b20]">
                Listing preview
              </p>
              <div className="relative mt-3 aspect-[1.4] overflow-hidden rounded-xl bg-[#eadfce]">
                <StudioImage
                  src={imageUrl}
                  alt={title ? `${title} preview` : "Studio listing preview"}
                  category={category}
                  sizes="300px"
                />
              </div>
              <h2 className="mt-4 truncate font-serif text-lg text-[#201a14]">
                {title || <>Your studio <span className="italic text-[#c66b20]">title</span></>}
              </h2>
              <div className="mt-1 flex justify-between gap-3 text-xs text-[#756b5e]">
                <span className="truncate">{category}</span>
                <span className="shrink-0 font-semibold text-[#201a14]">
                  ${hourlyRate || "—"} <span className="font-normal text-[#756b5e]">/ hour</span>
                </span>
              </div>
              {location ? (
                <p className="mt-2 flex items-center gap-1.5 truncate text-[11px] text-[#756b5e]">
                  <MapPin aria-hidden className="size-3 shrink-0" />
                  {location}
                </p>
              ) : null}
              <div className="my-4 h-px bg-[#eee7dc]" />
              <ul className="space-y-2.5 text-[11px] text-[#5e554a]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden className="size-4 shrink-0 text-emerald-600" />
                  {studio ? "Changes update your live listing" : "Saved to your studios as soon as you publish"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden className="size-4 shrink-0 text-emerald-600" />
                  {studio
                    ? studio.isAvailable
                      ? "Currently open for booking"
                      : "Currently paused for booking"
                    : "Open for booking right away"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden className="size-4 shrink-0 text-emerald-600" />
                  You’ll land on My listings to manage it
                </li>
              </ul>

              {errorMessage ? (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                  {errorMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 h-11 w-full rounded-xl bg-[#f4a000] text-sm font-semibold text-[#201a14] hover:bg-[#e89400]"
              >
                {isSubmitting
                  ? studio
                    ? "Saving changes…"
                    : "Publishing…"
                  : studio
                    ? "Save changes"
                    : "Publish studio"}
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/my-listings" />}
                variant="outline"
                className="mt-2 h-10 w-full rounded-xl border-[#e7dfd4] text-xs"
              >
                Cancel
              </Button>
              <p className="mt-3 text-center text-[10px] text-[#887e71]">
                Fields marked <RequiredMark /> are required.
              </p>
            </section>
          </aside>
        </form>
      </div>

      {showSuccessToast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#201a14] px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          <CheckCircle2 aria-hidden className="size-5 text-emerald-400" />
          {studio ? "Studio updated successfully" : "Studio published successfully"}
        </div>
      ) : null}
    </main>
  );
};

const RequiredMark = () => (
  <span aria-hidden className="inline text-[#c64e2a]">*</span>
);

const SectionTitle = ({
  number,
  id,
  lead,
  accent,
}: {
  number: string;
  id: string;
  lead: string;
  accent: string;
}) => (
  <h2 id={id} className="flex items-center gap-3 font-serif text-xl tracking-tight text-[#201a14]">
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#2b2118] font-sans text-[10px] text-white">
      {number}
    </span>
    {lead} <span className="-ml-2 italic text-[#c66b20]">{accent}</span>
  </h2>
);

export default AddStudioForm;
