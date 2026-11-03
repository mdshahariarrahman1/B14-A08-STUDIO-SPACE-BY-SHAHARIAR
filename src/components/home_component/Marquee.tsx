import { Suspense } from "react";
import { getStudios } from "@/lib/studios";
import StudioMarquee from "./StudioMarquee";

const StudioImages = async () => {
  const studios = await getStudios();
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
