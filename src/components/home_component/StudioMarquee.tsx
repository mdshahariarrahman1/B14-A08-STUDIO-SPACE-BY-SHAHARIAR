"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Marquee from "react-fast-marquee";
import StudioImage from "@/components/studios/StudioImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IStudio } from "@/type";

const StudioMarquee = ({ studios }: { studios: IStudio[] }) => (
  <section aria-label="Available creative studios" className="relative overflow-hidden py-16 sm:py-20">
    <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a05d2a]">
          Available now
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tighter text-[#201a14] sm:text-4xl">
          Handpicked spaces for your next shoot
        </h2>
      </div>
      <Button
        nativeButton={false}
        render={<Link href="/studios" />}
        variant="outline"
        className="hidden h-11 rounded-full border-[#e6dccd] bg-white px-5 text-sm font-semibold text-[#201a14] shadow-sm hover:bg-[#faf6ef] sm:inline-flex"
      >
        View all studios
        <ArrowRight className="size-4" />
      </Button>
    </div>

    <Marquee autoFill gradient gradientColor="#f7f3eb" pauseOnHover speed={42}>
      {studios.slice(0, 6).map((studio) => (
        <article key={studio._id} className="mx-3 w-[18rem] shrink-0 sm:w-84">
          <Card className="overflow-hidden border-[#f0e5d8] bg-white shadow-[0_18px_40px_-28px_rgba(32,26,20,0.32)] ring-0">
            <div className="relative h-52 w-full overflow-hidden">
              <StudioImage
                src={studio.imageUrl}
                alt={studio.title}
                category={studio.category}
                sizes="(max-width: 640px) 18rem, 21rem"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#1d1a17]/80 via-[#1d1a17]/20 to-transparent p-3 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur-sm">
                    {studio.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2 py-1 text-[10px] font-medium backdrop-blur-sm">
                    <Star className="size-3 fill-current" />
                    {studio.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="line-clamp-1 text-lg font-semibold text-[#201a14]">
                    {studio.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-[#655d56]">
                    <MapPin className="size-3.5" />
                    <span className="line-clamp-1">{studio.location}</span>
                  </div>
                </div>
                <div className="rounded-full bg-[#f6ece1] px-2.5 py-1 text-sm font-semibold text-[#84562b]">
                  ${studio.hourlyRate}
                  <span className="text-[10px] font-medium text-[#9a7e67]">/hr</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#f1e9df] pt-3 text-sm text-[#5b524b]">
                <span>{studio.maxCapacity} guests</span>
                <Link
                  href={`/studios/${studio._id}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#8d5324]"
                >
                  Book now
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      ))}
    </Marquee>
  </section>
);

export default StudioMarquee;
