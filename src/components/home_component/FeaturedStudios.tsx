import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudioCard from "@/components/studios/StudioCard";
import type { IStudio } from "@/type";

const FeaturedStudios = ({ studios }: { studios: IStudio[] }) => {
  const featured = studios.slice(0, 6);

  return (
    <section className="bg-[#f7f5f0] dark:bg-[#14100c] px-5 py-12 [contain-intrinsic-size:auto_900px] [content-visibility:auto] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#927d72] dark:text-[#a4987f]">
              Our spaces
            </p>
            <h2 className="mt-2.5 text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Six studios.
              <br />
              <span className="font-normal italic text-[#806049] dark:text-[#c8ab7f]">
                One creative home.
              </span>
            </h2>
          </div>
          <div className="flex items-end justify-between gap-5 sm:max-w-md sm:pb-1">
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Thoughtfully equipped spaces for your next big idea. Find the
              right room, walk in, and get creating.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/studios" />}
              variant="outline"
              className="h-10 shrink-0 rounded-full border-border bg-card px-4 text-sm"
            >
              View all <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
            {featured.map((studio) => (
              <StudioCard key={studio._id} studio={studio} variant="featured" />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            We&apos;re preparing our spaces. Please check back soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedStudios;