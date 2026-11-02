"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StudioImage from "@/components/studios/StudioImage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STUDIO_CATEGORIES } from "@/lib/studio-options";
import type { IStudio } from "@/type";

const categoryBackgrounds: Record<string, string> = {
  "Photo Studio": "bg-[#eadfce]",
  "Podcast Lounge": "bg-[#dcecf2]",
  "Film Stage": "bg-[#e8dff0]",
  "Music Suite": "bg-[#dcefe2]",
  Workshop: "bg-[#f1e7d2]",
};

export default function MyListingsDashboard({
  studios,
}: {
  studios: IStudio[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = useMemo(
    () => STUDIO_CATEGORIES.filter((category) => studios.some((studio) => studio.category === category)),
    [studios],
  );
  const visibleStudios =
    selectedCategory === "All"
      ? studios
      : studios.filter((studio) => studio.category === selectedCategory);
  const openStudios = studios.filter((studio) => studio.isAvailable).length;
  const averageRate = studios.length
    ? Math.round(studios.reduce((total, studio) => total + studio.hourlyRate, 0) / studios.length)
    : 0;

  return (
    <>
      <section aria-label="Listing statistics" className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card className="min-h-24 gap-2 rounded-xl border-[#eee7dc] bg-white p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#ffecd1] text-[#a75c16]">
              <Camera aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14]">{studios.length}</p>
            <p className="text-[11px] text-[#756b5e]">Total listings</p>
          </CardContent>
        </Card>
        <Card className="min-h-24 gap-2 rounded-xl border-[#eee7dc] bg-white p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e0f2e7] text-[#247443]">
              <CheckCircle2 aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14]">{openStudios}</p>
            <p className="text-[11px] text-[#756b5e]">Open for booking</p>
          </CardContent>
        </Card>
        <Card className="min-h-24 gap-2 rounded-xl border-[#eee7dc] bg-white p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e1eff8] text-[#286b98]">
              <Clock3 aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14]">${averageRate}</p>
            <p className="text-[11px] text-[#756b5e]">Average hourly rate</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-[#201a14]">
            Your <span className="italic text-[#c66b20]">studios</span>
          </h2>
          <span className="rounded-full bg-[#ffecd1] px-2.5 py-1 text-[10px] font-medium text-[#74400f]">
            {visibleStudios.length} {visibleStudios.length === 1 ? "listing" : "listings"}
          </span>
        </div>

        <div aria-label="Filter by category" className="mt-3 flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant="outline"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`h-7 rounded-full px-3 text-[10px] font-normal ${
                selectedCategory === category
                  ? "border-[#f4a000] bg-[#ffecd1] text-[#74400f] hover:bg-[#ffecd1]"
                  : "border-[#e8e0d5] bg-white text-[#201a14] hover:bg-[#faf7f1]"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {visibleStudios.length ? (
          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => (
              <Card
                key={studio._id}
                className="flex h-100 min-w-0 flex-col gap-0 rounded-2xl border-[#eee7dc] bg-white p-2 shadow-none ring-0"
              >
                <div className={`relative h-36 shrink-0 overflow-hidden rounded-xl sm:h-40 ${categoryBackgrounds[studio.category] ?? "bg-[#eadfce]"}`}>
                  <StudioImage
                    src={studio.imageUrl}
                    alt={studio.title}
                    category={studio.category}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span
                    className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${
                      studio.isAvailable
                        ? "bg-[#e0f2e7] text-[#247443]"
                        : "bg-[#eee9e1] text-[#5f574c]"
                    }`}
                  >
                    <span aria-hidden className="size-1 rounded-full bg-current" />
                    {studio.isAvailable ? "Available for booking" : "Paused"}
                  </span>
                </div>

                <CardHeader className="min-h-29 gap-1 px-2 pt-4 pb-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#bd5b0d]">
                    {studio.category}
                  </p>
                  <CardTitle className="line-clamp-1 min-h-5 truncate font-serif text-base font-normal leading-snug text-[#201a14]">
                    {studio.title}
                  </CardTitle>
                  <p className="flex items-center gap-1 truncate text-[10px] text-[#756b5e]">
                    <MapPin aria-hidden className="size-3 shrink-0" />
                    {studio.location}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-[#201a14]">
                    <Star aria-hidden className="size-3 fill-[#c8831d] text-[#c8831d]" />
                    {studio.reviewCount > 0
                      ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)`
                      : "No reviews yet"}
                  </p>
                </CardHeader>

                <CardContent className="flex min-h-12 flex-wrap content-start gap-1.5 px-2 pt-3 pb-2">
                  <span className="rounded-full bg-[#ffecd1] px-2 py-1 text-[9px] font-medium text-[#74400f]">
                    ${studio.hourlyRate} / hour
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e1eff8] px-2 py-1 text-[9px] font-medium text-[#245b7e]">
                    <Users aria-hidden className="size-2.5" />
                    {studio.maxCapacity} people
                  </span>
                  <span className="rounded-full bg-[#e0f2e7] px-2 py-1 text-[9px] font-medium text-[#245b3a]">
                    ${studio.securityDeposit} deposit
                  </span>
                </CardContent>

                <CardFooter className="mt-auto gap-2 border-t border-[#eee7dc] bg-transparent px-2 pt-3 pb-2">
                  <Button
                    nativeButton={false}
                    render={<Link href={`/studios/${encodeURIComponent(studio._id)}`} />}
                    className="h-9 flex-1 gap-2 rounded-lg bg-[#201a14] px-2 text-[11px] text-white hover:bg-[#3b3025]"
                  >
                    <Eye aria-hidden className="size-4" />
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    title="Editing listings is not available yet."
                    aria-label={`Edit ${studio.title} (not available yet)`}
                    className="h-9 flex-1 gap-2 rounded-lg border-[#e8e0d5] px-2 text-[11px] font-normal"
                  >
                    <Pencil aria-hidden className="size-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled
                    title="Deleting listings is not available yet."
                    aria-label={`Delete ${studio.title} (not available yet)`}
                    className="size-9 rounded-lg border-[#f1d8d2] text-[#b34130]"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-4 gap-3 rounded-2xl border-dashed border-[#d9cdbb] bg-white px-6 py-12 text-center shadow-none ring-0">
            <CardContent className="p-0">
              <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#fff1d9] text-[#9b5b19]">
                <Plus aria-hidden className="size-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-[#201a14]">
                {studios.length ? "No studios in this category" : "Your first listing starts here"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756b5e]">
                {studios.length
                  ? "Choose another category to see your studio listings."
                  : "Add your studio details and help creators find a space that fits their next project."}
              </p>
              {!studios.length ? (
                <Button
                  nativeButton={false}
                  render={<Link href="/add-studio" />}
                  className="mt-5 h-9 rounded-full bg-[#f4a000] px-5 text-sm font-semibold text-[#201a14] hover:bg-[#e89400]"
                >
                  Add your studio <Plus aria-hidden className="size-4" />
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
