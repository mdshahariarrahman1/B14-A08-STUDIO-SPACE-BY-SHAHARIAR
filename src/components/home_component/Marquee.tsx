import { Suspense } from "react";
import { getStudiosResult } from "@/lib/studios-server";
import StudioMarquee from "./StudioMarquee";
import StudiosUnavailable from "./StudiosUnavailable";

const StudioImages = async () => {
  const result = await getStudiosResult();
  if (!result.ok) {
    return <StudiosUnavailable label="Studio highlights are temporarily unavailable" />;
  }
  return <StudioMarquee studios={result.studios} />;
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
