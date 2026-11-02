"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGES = {
  photo: "/images/hero-studio-sunlit.jpg",
  film: "/images/hero-studio-architecture.jpg",
  audio: "/images/hero-studio-workspace.jpg",
  default: "/images/hero-studio-workspace.jpg",
} as const;

function getFallbackImage(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("photo")) return FALLBACK_IMAGES.photo;
  if (normalized.includes("film")) return FALLBACK_IMAGES.film;
  if (normalized.includes("podcast") || normalized.includes("music")) {
    return FALLBACK_IMAGES.audio;
  }
  return FALLBACK_IMAGES.default;
}

function StudioImage({
  src,
  alt,
  category,
  sizes,
  className = "",
}: {
  src?: string | null;
  alt: string;
  category: string;
  sizes: string;
  className?: string;
}) {
  const imageSrc = src?.trim() || null;
  const fallbackSrc = getFallbackImage(category);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const shouldUseFallback =
    !imageSrc || imageSrc === fallbackSrc || failedSrc === imageSrc;

  return (
    <Image
      src={shouldUseFallback ? fallbackSrc : imageSrc}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      onError={() => {
        if (!shouldUseFallback) {
          setFailedSrc(imageSrc);
        }
      }}
      className={`object-cover ${className}`}
    />
  );
}

export default StudioImage;
