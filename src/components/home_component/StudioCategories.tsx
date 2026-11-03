import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import StudioImage from "@/components/studios/StudioImage";
import { normalizeStudioCategory } from "@/lib/studios";
import { getStudios } from "@/lib/studios-server";
import type { IStudio } from "@/type";

const CategoriesFallback = ({ message }: { message: string }) => (
  <section
    aria-label="Studio categories unavailable"
    className="bg-[#1A120B] px-5 py-14 sm:px-8 sm:py-20"
  >
    <div className="mx-auto max-w-6xl">
      <div className="rounded-xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-[#FAF7F2]">
          Categories are on the way
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/60">
          {message}
        </p>
      </div>
    </div>
  </section>
);

const StudioCategories = async () => {
  let studios: IStudio[];

  try {
    studios = await getStudios();
  } catch (error) {
    // Framework control-flow errors (e.g. the prerender cut-off aborting
    // uncached fetches) must keep flowing so the section stays dynamic;
    // only real failures should render the fallback panel.
    unstable_rethrow(error);
    console.error("Failed to load studio categories:", error);
    return (
      <CategoriesFallback message="We couldn't load the studio catalog right now — categories will show up here as soon as it is back." />
    );
  }

  if (studios.length === 0) {
    return (
      <CategoriesFallback message="No studios are listed yet — categories will appear here automatically as soon as they are added." />
    );
  }

  // Group studios by their exact category value from the catalog, so every
  // category in the database shows up here without any code changes.
  const studiosByCategory = new Map<
    string,
    { name: string; studios: IStudio[] }
  >();

  for (const studio of studios) {
    const name = studio.category.trim().replace(/\s+/g, " ");
    const key = normalizeStudioCategory(name);
    if (!key) continue;

    const group = studiosByCategory.get(key);
    if (group) {
      group.studios.push(studio);
    } else {
      studiosByCategory.set(key, { name, studios: [studio] });
    }
  }

  const categories = [...studiosByCategory.values()]
    .map(({ name, studios: group }) => {
      // Feature the category through its highest-rated studio's imagery.
      const representative = [...group].sort(
        (a, b) => b.rating - a.rating || a.title.localeCompare(b.title),
      )[0];
      return {
        name,
        count: group.length,
        image: representative.imageUrl,
        alt: representative.title,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return (
    <section
      id="studio-categories"
      aria-labelledby="studio-categories-heading"
      className="scroll-mt-20 bg-[#1A120B] px-5 py-14 text-white sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E897A9]">
            <span aria-hidden>&bull; </span>Studio categories
          </p>
          <h2
            id="studio-categories-heading"
            className="mt-3 text-4xl font-medium leading-[1.05] tracking-tight text-[#FAF7F2] sm:text-5xl"
          >
            Browse by studio
            <br />
            <span className="font-normal italic text-[#D8C4AE]">
              category.
            </span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={`/studios?category=${encodeURIComponent(category.name)}`}
              aria-label={`Browse ${category.name} studios`}
              className="group relative block h-52 overflow-hidden rounded-xl border border-white/10 bg-[#2A1B10] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E897A9] sm:last:col-span-2 lg:h-64 lg:last:col-span-1"
            >
              <StudioImage
                src={category.image}
                alt={category.alt}
                category={category.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="absolute right-3 top-2 text-5xl font-light text-white/20"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-white/65">
                    {category.count === 1
                      ? "1 space"
                      : `${category.count} spaces`}
                  </p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-white/90 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-white/30 group-hover:bg-white/20">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioCategories;
