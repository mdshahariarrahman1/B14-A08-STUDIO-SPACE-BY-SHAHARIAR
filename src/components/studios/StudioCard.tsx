"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StudioImage from "@/components/studios/StudioImage";
import type { IStudio } from "@/type";

const StudioCard = ({
  studio,
  variant = "default",
  action,
}: {
  studio: IStudio;
  variant?: "default" | "featured" | "listing";
  action?: ReactNode;
}) => {
  const isFeatured = variant === "featured";
  const isListing = variant === "listing";
  const categoryLabel: Record<string, string> = {
    "Photo Studio": "Photo",
    "Podcast Lounge": "Audio",
    "Music Suite": "Audio",
    "Film Stage": "Video",
  };
  const description =
    studio.overview.length > 112
      ? `${studio.overview.slice(0, 109).trimEnd()}…`
      : studio.overview;

  if (isListing) {
    const categoryBackgrounds: Record<string, string> = {
      "Photo Studio": "bg-[#eadfce] dark:bg-[#1f1911]",
      "Podcast Lounge": "bg-[#dcecf2] dark:bg-[#10283c]",
      "Film Stage": "bg-[#e8dff0] dark:bg-[#2b2140]",
      "Music Suite": "bg-[#dcefe2] dark:bg-[#10301f]",
      Workshop: "bg-[#f1e7d2] dark:bg-[#1f1911]",
    };

    return (
      <Card className="flex h-100 min-w-0 flex-col gap-0 rounded-2xl border-[#eee7dc] dark:border-[#33291d] bg-card p-2 shadow-none ring-0">
        <div
          className={`relative h-36 shrink-0 overflow-hidden rounded-xl sm:h-40 ${
            categoryBackgrounds[studio.category] ?? "bg-[#eadfce] dark:bg-[#1f1911]"
          }`}
        >
          <StudioImage
            src={studio.imageUrl}
            alt={studio.title}
            category={studio.category}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span
            className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${
              studio.isAvailable
                ? "bg-[#e0f2e7] dark:bg-[#10301f] text-[#247443] dark:text-[#8fe3b4]"
                : "bg-[#eee9e1] dark:bg-[#1f1911] text-[#5f574c] dark:text-[#c9bda8]"
            }`}
          >
            <span aria-hidden className="size-1 rounded-full bg-current" />
            {studio.isAvailable ? "Available for booking" : "Paused"}
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[9px] font-semibold text-[#201a14] dark:text-[#f2eadf]">
            <Star aria-hidden className="size-3 fill-[#c8831d] text-[#c8831d]" />
            {studio.rating}
          </span>
          <span className="absolute bottom-2 left-2 text-[10px] text-white drop-shadow-sm">
            Studio photo
          </span>
        </div>

        <CardHeader className="min-h-29 gap-1 px-2 pt-4 pb-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#bd5b0d] dark:text-[#f0a63c]">
            {studio.category}
          </p>
          <CardTitle className="line-clamp-1 min-h-5 truncate font-serif text-base font-normal leading-snug text-[#201a14] dark:text-[#f2eadf]">
            {studio.title}
          </CardTitle>
          <p className="flex items-center gap-1 truncate text-[10px] text-[#756b5e] dark:text-[#a4987f]">
            <MapPin aria-hidden className="size-3 shrink-0" />
            {studio.location}
          </p>
          <p className="flex items-center gap-1 text-[10px] text-[#201a14] dark:text-[#f2eadf]">
            <Star aria-hidden className="size-3 fill-[#c8831d] text-[#c8831d]" />
            {studio.reviewCount > 0
              ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)`
              : "No reviews yet"}
          </p>
        </CardHeader>

        <CardContent className="flex min-h-12 flex-wrap content-start gap-1.5 px-2 pt-3 pb-2">
          <span className="rounded-full bg-[#ffecd1] dark:bg-[#3a2a12] px-2 py-1 text-[9px] font-medium text-[#74400f] dark:text-[#f5cf8d]">
            ${studio.hourlyRate} / hour
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e1eff8] dark:bg-[#10283c] px-2 py-1 text-[9px] font-medium text-[#245b7e] dark:text-[#9fcaf5]">
            <Users aria-hidden className="size-2.5" />
            {studio.maxCapacity} people
          </span>
          <span className="rounded-full bg-[#e0f2e7] dark:bg-[#10301f] px-2 py-1 text-[9px] font-medium text-[#245b3a] dark:text-[#8fe3b4]">
            ${studio.securityDeposit} deposit
          </span>
        </CardContent>

        <CardFooter className="mt-auto gap-2 border-t border-[#eee7dc] dark:border-[#33291d] bg-transparent px-2 pt-3 pb-2">
          <Button
            nativeButton={false}
            render={
              <Link href={`/studios/${encodeURIComponent(studio._id)}`} />
            }
            className="h-9 flex-1 gap-2 rounded-lg bg-[#201a14] px-2 text-[11px] text-white hover:bg-[#3b3025]"
          >
            <Eye aria-hidden className="size-4" />
            View Details
          </Button>
          {action ? action : null}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className={`gap-0 overflow-hidden rounded-lg bg-card py-0 shadow-sm ring-black/8 transition-shadow duration-300 hover:shadow-md ${
        isFeatured ? "h-full" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#ded6c9] ${
          isFeatured ? "h-60 sm:h-64 lg:h-72" : "h-36 sm:h-40"
        }`}
      >
      <StudioImage
        src={studio.imageUrl}
        alt={studio.title}
        category={studio.category}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="transition-transform duration-500 group-hover/card:scale-105"
      />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-sm">
          {isFeatured
            ? categoryLabel[studio.category] ?? studio.category
            : studio.category}
        </span>
        {!isFeatured ? (
          <>
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-card px-2 py-1 text-[10px] font-semibold text-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {studio.rating.toFixed(1)}
            </span>
            <span className="absolute bottom-2 left-2 text-[10px] text-foreground drop-shadow-sm">
              Studio photo
            </span>
          </>
        ) : null}
      </div>

      <CardHeader
        className={`gap-1 px-3 pb-0 ${
          isFeatured ? "flex-1 gap-1.5 px-4 pt-4" : "pt-3"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <CardTitle
            className={`truncate font-semibold ${
              isFeatured ? "text-base sm:text-lg" : "text-sm"
            }`}
          >
            {studio.title}
          </CardTitle>
          {isFeatured ? (
            <Button
              nativeButton={false}
              render={
                <Link
                  href={`/studios/${encodeURIComponent(studio._id)}`}
                  aria-label={`View details for ${studio.title}`}
                />
              }
              variant="default"
              size="icon"
              className="size-8 shrink-0 rounded-full bg-[#171717] text-white hover:bg-[#70543e]"
            >
              <ArrowUpRight />
            </Button>
          ) : null}
        </div>
        {isFeatured ? (
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            {studio.location}
          </p>
        )}
      </CardHeader>

      <CardContent
        className={`pt-3 pb-0 ${isFeatured ? "px-4 pt-4" : "px-3"}`}
      >
        <div className="border-t border-border" />
      </CardContent>

      <CardFooter
        className={`flex items-center justify-between gap-2 rounded-b-lg border-0 bg-transparent px-3 ${
          isFeatured ? "px-4 py-3.5" : "py-2.5"
        }`}
      >
        <p
          className={`font-semibold text-foreground ${
            isFeatured ? "text-sm" : "text-xs"
          }`}
        >
          {isFeatured ? "From " : ""}${studio.hourlyRate}
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">
            / hr
          </span>
        </p>
        {isFeatured ? (
          <span className="text-[10px] text-muted-foreground">
            Hourly · Daily · Project
          </span>
        ) : (
          <Button
            nativeButton={false}
            render={
              <Link href={`/studios/${encodeURIComponent(studio._id)}`} />
            }
            className="h-7 rounded-md bg-[#151619] px-3 text-[10px] text-white hover:bg-neutral-700"
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudioCard;
