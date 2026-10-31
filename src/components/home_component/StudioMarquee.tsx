"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
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
      {studios.map((studio) => (
        <article
          key={studio._id}
          className="mx-3 w-70 shrink-0 overflow-hidden rounded-2xl border bg-white shadow-sm sm:w-80"
        >
          <div className="relative h-48 w-full">
            <Image
              src={studio.imageUrl}
              alt={studio.title}
              fill
              unoptimized
              sizes="220px"
              className="object-cover"
            />
          </div>
        </article>
      ))}
    </Marquee>
  </section>
);

export default StudioMarquee;
