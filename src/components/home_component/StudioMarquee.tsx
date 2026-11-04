"use client";

import { memo } from "react";
import Marquee from "react-fast-marquee";
import StudioImage from "@/components/studios/StudioImage";
import type { IStudio } from "@/type";

const StudioCard = memo(({ studio }: { studio: IStudio }) => (
  <article
    className="mx-3 w-70 shrink-0 overflow-hidden rounded-2xl border bg-white shadow-sm sm:w-80"
    style={{ willChange: "transform", contain: "layout paint" }}
  >
    <div className="relative h-48 w-full">
      <StudioImage
        src={studio.imageUrl}
        alt={studio.title}
        category={studio.category}
        sizes="(min-width: 640px) 320px, 280px"
      />
    </div>
  </article>
));
StudioCard.displayName = "StudioCard";

const StudioMarquee = ({ studios }: { studios: IStudio[] }) => (
  <section
    aria-label="Available creative studios"
    className="overflow-hidden py-10"
  >
    <Marquee
      autoFill
      gradient
      gradientColor="#ffffff"
      gradientWidth={60}
      pauseOnHover={false}
      speed={40}
    >
      {studios.slice(0, 6).map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
    </Marquee>
  </section>
);

export default memo(StudioMarquee);