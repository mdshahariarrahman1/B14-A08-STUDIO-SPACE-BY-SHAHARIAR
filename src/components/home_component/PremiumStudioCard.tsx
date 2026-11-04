"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Sparkles, UsersRound } from "lucide-react";
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

const PremiumStudioCard = ({
  studio,
  popular = false,
}: {
  studio: IStudio;
  popular?: boolean;
}) => (
  <Card className="group gap-0 overflow-hidden rounded-xl border-0 bg-card py-0 shadow-[0_12px_40px_rgba(27,22,18,0.07)] ring-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(27,22,18,0.12)]">
    <div className="relative h-60 overflow-hidden bg-[#e8e4de] dark:bg-[#1f1911] sm:h-64 lg:h-72">
      <StudioImage
        src={studio.imageUrl}
        alt={studio.title}
        category={studio.category}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
        className="transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
        {studio.studioType?.trim() || "Type unavailable"}
      </span>
      {popular ? (
        <span className="absolute right-4 top-4 rounded-full bg-neutral-950/75 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm backdrop-blur">
          Most popular
        </span>
      ) : null}
    </div>

    <CardHeader className="gap-2 px-5 pt-5 pb-0 sm:px-6 sm:pt-6">
      <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#927d72] dark:text-[#a4987f]">
        Premium studio
      </p>
      <div className="flex items-start justify-between gap-3">
        <CardTitle className="text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl">
          {studio.title}
        </CardTitle>
        <span className="shrink-0 rounded-full bg-[#f7f5f0] dark:bg-[#14100c] px-2.5 py-1 text-[10px] text-muted-foreground">
          Up to {studio.maxCapacity} crew
        </span>
      </div>
      <p className="line-clamp-3 min-h-18 text-xs leading-5 text-muted-foreground sm:text-[13px]">
        {studio.overview}
      </p>
    </CardHeader>

    <CardContent className="px-5 pt-4 pb-0 sm:px-6">
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-border pb-4 text-[10px] text-muted-foreground sm:text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-[#927d72] dark:text-[#a4987f]" />
          {studio.amenities[0] ?? "Premium equipment"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <UsersRound className="size-3.5 text-[#927d72] dark:text-[#a4987f]" />
          Up to {studio.maxCapacity} crew
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-3.5 text-[#927d72] dark:text-[#a4987f]" />
          Flexible hours
        </span>
      </div>
    </CardContent>

    <CardFooter className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-sm font-medium text-foreground">
        From ${studio.hourlyRate} / hr
      </p>
      <Button
        nativeButton={false}
        render={
          <Link href={`/studios/${encodeURIComponent(studio._id)}`} />
        }
        variant="outline"
        className="h-9 rounded-full border-border px-4 text-xs font-medium"
      >
        View details <ArrowRight data-icon="inline-end" />
      </Button>
    </CardFooter>
  </Card>
);

export default PremiumStudioCard;
