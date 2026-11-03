"use client";

import Marquee from "react-fast-marquee";
import StudioImage from "@/components/studios/StudioImage";
import type { IStudio } from "@/type";

const StudioMarquee = ({ studios }: { studios: IStudio[] }) => (
  <section
    aria-label="Available creative studios"
    className="overflow-hidden py-10"
  >
    <Marquee
      autoFill
      gradient
      gradientColor="#ffffff"
      pauseOnHover={false}
      speed={40}
    >
      {studios.slice(0, 6).map((studio) => (
        <article
          key={studio._id}
          className="mx-3 w-70 shrink-0 overflow-hidden rounded-2xl border bg-white shadow-sm sm:w-80"
        >
          <div className="relative h-48 w-full">
            <StudioImage
              src={studio.imageUrl}
              alt={studio.title}
              category={studio.category}
              sizes="220px"
            />
          </div>
        </article>
      ))}
    </Marquee>
  </section>
);

export default StudioMarquee;
