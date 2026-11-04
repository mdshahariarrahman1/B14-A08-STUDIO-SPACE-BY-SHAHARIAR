import { Suspense } from "react";
import { connection } from "next/server";
import HomeContent from "@/components/home_component/HeroSection";
import HowItWorks from "@/components/home_component/HowItWorks";

import PremiumStudios from "@/components/home_component/PremiumStudios";
import StudioCategories from "@/components/home_component/StudioCategories";
import Testimonials from "@/components/home_component/Testimonials";
import Pricing from "@/components/home_component/Pricing";
import TrustedBrands from "@/components/home_component/TrustedBrands";
import { getStudiosResult } from "@/lib/studios-server";
import MarqueePage from "@/components/home_component/Marquee";
import FeaturedStudios from "@/components/home_component/FeaturedStudios";
import StudiosUnavailable from "@/components/home_component/StudiosUnavailable";

const PremiumStudioData = async () => {
  await connection();
  const result = await getStudiosResult();
  if (!result.ok) {
    return <StudiosUnavailable label="Premium studios are temporarily unavailable" />;
  }
  return <PremiumStudios studios={result.studios} />;
};

const FeaturedStudioData = async () => {
  const result = await getStudiosResult();
  if (!result.ok) {
    return <StudiosUnavailable label="Featured studios are temporarily unavailable" />;
  }
  return <FeaturedStudios studios={result.studios} />;
};

const HomePage = () => {
  return (
    <>
      
      <main>
        <HomeContent />
        <MarqueePage />
        <TrustedBrands />
        <Suspense
          fallback={
            <div
              aria-label="Loading studio categories"
              className="min-h-128 animate-pulse bg-[#1A120B]"
            />
          }
        >
          <StudioCategories />
        </Suspense>

        <Suspense
          fallback={
            <div
              aria-label="Loading featured studios"
              className="h-96 animate-pulse bg-[#f7f5f0] dark:bg-[#14100c]"
            />
          }
        >
          <FeaturedStudioData />
        </Suspense>
        <Suspense
          fallback={
            <div
              aria-label="Loading premium studios"
              className="h-96 animate-pulse bg-card"
            />
          }
        >
          <PremiumStudioData />
        </Suspense>
        <HowItWorks />
        <Pricing />
        <Testimonials />
      </main>
    </>
  );
};

export default HomePage;
