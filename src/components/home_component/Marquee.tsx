import { Suspense } from "react";
import type { IStudio } from "@/type";
import StudioMarquee from "./StudioMarquee";

const StudioImages = async () => {
  const response = await fetch("http://localhost:5000/studios", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      `Failed to load studios: ${response.status} ${response.statusText}`,
    );
  }

  const studios: IStudio[] = await response.json();

  return <StudioMarquee studios={studios} />;
};

const MarqueePage = () => (
  <Suspense
    fallback={
      <div
        aria-label="Loading studios"
        className="h-70 w-full animate-pulse bg-neutral-100"
      />
    }
  >
    <StudioImages />
  </Suspense>
);

export default MarqueePage;
