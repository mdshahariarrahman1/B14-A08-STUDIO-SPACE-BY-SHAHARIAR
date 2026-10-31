import { Suspense } from "react";
import NavbarPage from "@/components/home_component/Navbar";
import StudioExplorer from "@/components/studios/StudioExplorer";
import { getStudios } from "@/lib/studios";

const StudioListing = async () => {
  const studios = await getStudios();
  return <StudioExplorer studios={studios} />;
};

const ExploreStudiosPage = () => {
  return (
    <>
      <NavbarPage />
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