import { Suspense } from "react";
import HomeContent from "@/components/home_component/HeroSection";
import HowItWorks from "@/components/home_component/HowItWorks";

import PremiumStudios from "@/components/home_component/PremiumStudios";
import StudioCategories from "@/components/home_component/StudioCategories";
import Testimonials from "@/components/home_component/Testimonials";
import Pricing from "@/components/home_component/Pricing";
import TrustedBrands from "@/components/home_component/TrustedBrands";
import { getStudios } from "@/lib/studios";
import MarqueePage from "@/components/home_component/Marquee";
import FeaturedStudios from "@/components/home_component/FeaturedStudios";

const PremiumStudioData = async () => {
  const studios = await getStudios();
  return <PremiumStudios studios={studios} />;
};

const FeaturedStudioData = async () => {
  const studios = await getStudios();
  return <FeaturedStudios studios={studios} />;
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
              className="h-96 animate-pulse bg-[#f7f5f0]"
            />
          }
        >
          <FeaturedStudioData />
        </Suspense>
        <Suspense
          fallback={
            <div
              aria-label="Loading premium studios"
              className="h-96 animate-pulse bg-white"
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
