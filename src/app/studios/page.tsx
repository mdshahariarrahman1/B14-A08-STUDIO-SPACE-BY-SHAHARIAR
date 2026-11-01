import { Suspense } from "react";
import StudioExplorer from "@/components/studios/StudioExplorer";
import { getStudios } from "@/lib/studios";

const StudioListing = async () => {
  const studios = await getStudios();
  return <StudioExplorer studios={studios} />;
};

const ExploreStudiosPage = () => {
  return (
    <>
      <Suspense
        fallback={
          <div
            aria-label="Loading studios"
            className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f5f0]"
          />
        }
      >
        <StudioListing />
      </Suspense>
    </>
  );
};

export default ExploreStudiosPage;