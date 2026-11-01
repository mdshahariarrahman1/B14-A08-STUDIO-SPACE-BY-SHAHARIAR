"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IStudio } from "@/type";

const StudioCard = ({
  studio,
  variant = "default",
}: {
  studio: IStudio;
  variant?: "default" | "featured";
}) => {
  const isFeatured = variant === "featured";
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

  return (
    <Card
      className={`gap-0 overflow-hidden rounded-lg bg-white py-0 shadow-sm ring-black/8 transition-shadow duration-300 hover:shadow-md ${
        isFeatured ? "h-full" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#ded6c9] ${
          isFeatured ? "h-60 sm:h-64 lg:h-72" : "h-36 sm:h-40"
        }`}
      >
      {studio.imageUrl ? (
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[#aaa398]">
          <span aria-hidden className="text-5xl font-light">
            ◎
          </span>
        </div>
      )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-neutral-800 shadow-sm backdrop-blur-sm">
          {isFeatured
            ? categoryLabel[studio.category] ?? studio.category
            : studio.category}
        </span>
        {!isFeatured ? (
          <>
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-neutral-800">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {studio.rating.toFixed(1)}
            </span>
            <span className="absolute bottom-2 left-2 text-[10px] text-neutral-800 drop-shadow-sm">
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
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        ) : (
          <p className="flex items-center gap-1 truncate text-[11px] text-neutral-500">
            <MapPin className="size-3 shrink-0" />
            {studio.location}
          </p>
        )}
      </CardHeader>

      <CardContent
        className={`pt-3 pb-0 ${isFeatured ? "px-4 pt-4" : "px-3"}`}
      >
        <div className="border-t border-neutral-100" />
      </CardContent>

      <CardFooter
        className={`flex items-center justify-between gap-2 rounded-b-lg border-0 bg-transparent px-3 ${
          isFeatured ? "px-4 py-3.5" : "py-2.5"
        }`}
      >
        <p
          className={`font-semibold text-neutral-900 ${
            isFeatured ? "text-sm" : "text-xs"
          }`}
        >
          {isFeatured ? "From " : ""}${studio.hourlyRate}
          <span className="ml-1 text-[10px] font-normal text-neutral-500">
            / hr
          </span>
        </p>
        {isFeatured ? (
          <span className="text-[10px] text-neutral-400">
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
