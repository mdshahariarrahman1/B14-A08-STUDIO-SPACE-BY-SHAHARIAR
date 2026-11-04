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
    <section className="relative isolate flex min-h-140 items-center justify-center overflow-hidden bg-[#FAFAF9] dark:bg-[#1c1610] px-4 py-20 sm:px-6 md:min-h-155 md:py-24">
      <Carousel
        aria-label="Featured creative studios"
        className="hero-background-carousel absolute inset-0 z-0 h-full w-full"
        opts={{ loop: true }}
        plugins={[autoplayPlugin]}
      >
        <CarouselContent className="h-full ml-0">
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
          className="pointer-events-none absolute inset-0 z-10 bg-neutral-950/55"
        />
        <CarouselPrevious
          aria-label="Previous background image"
          className="left-4 top-1/2 z-20 size-11 -translate-y-1/2 border-white/50 bg-black/30 text-white hover:bg-black/55 hover:text-white sm:left-6"
        />
        <CarouselNext
          aria-label="Next background image"
          className="right-4 top-1/2 z-20 size-11 -translate-y-1/2 border-white/50 bg-black/30 text-white hover:bg-black/55 hover:text-white sm:right-6"
        />
      </Carousel>

      <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-card/95 py-1.5 pr-4 pl-1.5 shadow-sm">
          <AvatarGroup>
            {CREATORS.map((creator) => (
              <Avatar key={creator.initials} className="size-8">
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
          <span className="text-sm font-medium text-muted-foreground">
            2,400+ creators booked
          </span>
        </div>

        <h1 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
          Premium{" "}
          <span className="italic text-[#F0C6A7]">Creative Studios</span> Built
          For Creators Who Value Quality.
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
            className="h-12 w-full rounded-full bg-[#6F4E37] px-7 text-sm font-semibold text-white hover:bg-[#5E402D] sm:w-auto"
          >
            Explore Studios
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/studios" />}
            className="h-12 w-full rounded-full border border-white/70 bg-card/10 px-7 text-sm font-semibold text-white hover:bg-card/20 sm:w-auto"
          >
            Host Your Space
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
