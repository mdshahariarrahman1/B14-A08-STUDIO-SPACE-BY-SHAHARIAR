"use client";

import Autoplay from "embla-carousel-autoplay";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

const CREATORS = [
  {
    initials: "KA",
    className: "bg-[#F2994A] text-white",
    image: "/images/creator-avatar-ka.jpg",
  },
  {
    initials: "RS",
    className: "bg-[#2BB5A0] text-white",
    image: "/images/creator-avatar-rs.jpg",
  },
  {
    initials: "MT",
    className: "bg-[#E2574C] text-white",
    image: "/images/creator-avatar-mt.jpg",
  },
];

const SLIDES = [
  {
    image: "/images/hero-studio-workspace.jpg",
    alt: "Bright creative studio with a large shared workspace",
  },
  {
    image: "/images/hero-studio-architecture.jpg",
    alt: "Modern architectural studio interior",
  },
  {
    image: "/images/hero-studio-sunlit.jpg",
    alt: "Sunlit workspace ready for a creative project",
  },
];

const HeroSection = () => {
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  return (
    <section className="relative isolate flex min-h-136 items-center justify-center overflow-hidden bg-[#f8f4ee] px-4 py-20 sm:px-6 md:min-h-168 md:py-24">
      <Carousel
        aria-label="Featured creative studios"
        className="hero-background-carousel absolute inset-0 z-0 h-full w-full"
        opts={{ loop: true }}
        plugins={[autoplayPlugin]}
      >
        <CarouselContent className="ml-0 h-full">
          {SLIDES.map((slide, index) => (
            <CarouselItem key={slide.image} className="relative h-full pl-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : "eager"}
                sizes="100vw"
                quality={80}
                className="object-cover object-center"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(120deg,rgba(16,12,8,0.75),rgba(16,12,8,0.45),rgba(16,12,8,0.7))]"
        />
        <CarouselPrevious
          aria-label="Previous background image"
          className="left-4 top-1/2 z-20 size-11 -translate-y-1/2 border-white/50 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white sm:left-6"
        />
        <CarouselNext
          aria-label="Next background image"
          className="right-4 top-1/2 z-20 size-11 -translate-y-1/2 border-white/50 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white sm:right-6"
        />
      </Carousel>

      <div className="relative z-20 mx-auto max-w-6xl px-2">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="flex items-center gap-2.5 rounded-full border border-white/35 bg-white/90 py-1.5 pr-4 pl-1.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            <AvatarGroup>
              {CREATORS.map((creator) => (
                <Avatar key={creator.initials} className="size-8 ring-2 ring-white">
                  <AvatarImage
                    src={creator.image}
                    alt={`${creator.initials} creator profile`}
                  />
                  <AvatarFallback className={creator.className}>
                    {creator.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <span className="text-sm font-medium text-neutral-700">
              2,400+ creators booked
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl lg:leading-[0.98]">
            Premium <span className="italic text-[#f8d7b5]">Creative Studios</span>
            <span className="mt-2 block">Built for better work.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            Book ready-to-use podcast, photography, and video studios by the
            hour, day, or project. Premium lighting, full kit, zero setup — just
            walk in and create.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              nativeButton={false}
              render={<Link href="/studios" />}
              className="h-12 w-full rounded-full bg-[#d98548] px-7 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(217,133,72,0.95)] hover:bg-[#c97532] sm:w-auto"
            >
              Explore Studios
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/studios" />}
              className="h-12 w-full rounded-full border border-white/60 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 sm:w-auto"
            >
              Host Your Space
            </Button>
          </div>

          <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["4.9/5", "Average rating"],
              ["120+", "Verified spaces"],
              ["< 12m", "Average booking time"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-center backdrop-blur-sm"
              >
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/70">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
