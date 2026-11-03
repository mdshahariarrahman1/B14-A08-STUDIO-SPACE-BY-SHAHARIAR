import type { Metadata } from "next";
import AboutPage from "@/components/home_component/AboutPage";

export const metadata: Metadata = {
  title: "About Us | StudioSpace",
  description:
    "Learn how StudioSpace connects creators with bookable studios and helps hosts share their spaces.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
