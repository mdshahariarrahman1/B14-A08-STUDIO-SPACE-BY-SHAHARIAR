import PremiumStudioCard from "./PremiumStudioCard";
import type { IStudio } from "@/type";

const PremiumStudios = ({ studios }: { studios: IStudio[] }) => {
  const premiumStudios = studios
    .filter((studio) => studio.studioType?.trim().toLowerCase() === "premium")
    .sort((first, second) => second.rating - first.rating);

  return (
    <section
      aria-labelledby="premium-studios-heading"
      className="bg-white px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end sm:gap-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#927d72]">
              <span aria-hidden>· </span>Feature spaces
            </p>
            <h2
              id="premium-studios-heading"
              className="mt-2 text-4xl font-medium leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl"
            >
              Premium studios.
              <br />
              <span className="font-normal italic text-[#806049]">
                Exceptional results.
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-neutral-500">
            Our flagship spaces, equipped for demanding productions. Every
            detail designed to help your creative work shine.
          </p>
        </div>

        {premiumStudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7">
            {premiumStudios.map((studio, index) => (
              <PremiumStudioCard
                key={studio._id}
                studio={studio}
                popular={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-[#faf9f7] px-6 py-12 text-center">
            <p className="text-sm font-medium text-neutral-800">
              Premium studios are coming soon
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-neutral-500">
              There are no studios in the Premium category yet. Add a Premium
              studio to the catalog and it will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumStudios;
