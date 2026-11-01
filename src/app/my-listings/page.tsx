import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, MapPin, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/server-auth";
import { getStudios } from "@/lib/studios";

export const metadata: Metadata = {
  title: "My listings | StudioSpace",
  description: "Manage the studios you have listed on StudioSpace.",
};

async function PrivateMyListingsPage() {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login?callbackURL=%2Fmy-listings");
  }

  const studios = await getStudios();
  const myStudios = studios.filter(
    (studio) => studio.ownerEmail?.toLowerCase() === user.email.toLowerCase(),
  );

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f3eb] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-xs text-[#756b5e]">
          <Link className="underline underline-offset-2 hover:text-[#201a14]" href="/studios">
            Spaces
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span>My listings</span>
        </nav>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c66b20]">
              Your studio spaces
            </p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-[#201a14] sm:text-5xl">
              My <span className="font-serif italic text-[#c66b20]">listings</span>
            </h1>
            <p className="mt-3 text-sm text-[#62594e]">
              {myStudios.length} {myStudios.length === 1 ? "studio" : "studios"} listed
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/add-studio" />}
            className="h-10 rounded-full bg-[#f4a000] px-5 text-sm font-semibold text-[#201a14] hover:bg-[#e89400]"
          >
            <Plus aria-hidden className="size-4" />
            Add new studio
          </Button>
        </div>

        {myStudios.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {myStudios.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-[#eee7dc] bg-white shadow-sm"
              >
                <Link
                  href={`/studios/${encodeURIComponent(studio._id)}`}
                  className="group block"
                  aria-label={`View ${studio.title}`}
                >
                  <div className="relative aspect-[1.55] bg-[#eadfce]">
                    {studio.imageUrl ? (
                      <Image
                        src={studio.imageUrl}
                        alt={studio.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-medium ${
                        studio.isAvailable
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {studio.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a06a3b]">
                      {studio.category}
                    </p>
                    <h2 className="mt-1 truncate text-lg font-semibold text-[#201a14]">
                      {studio.title}
                    </h2>
                    <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-[#756b5e]">
                      <MapPin aria-hidden className="size-3.5 shrink-0" />
                      {studio.location}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#eee7dc] pt-3">
                      <p className="text-sm font-semibold text-[#201a14]">
                        ${studio.hourlyRate}
                        <span className="ml-1 text-[10px] font-normal text-[#756b5e]">/ hour</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-[#756b5e]">
                        <Star aria-hidden className="size-3.5 fill-amber-400 text-amber-400" />
                        {studio.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#8a571d]">
                      View studio <ArrowRight aria-hidden className="size-3.5" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-2xl border border-dashed border-[#d9cdbb] bg-white px-6 py-16 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#fff1d9] text-[#9b5b19]">
              <Plus aria-hidden className="size-5" />
            </div>
            <h2 className="mt-4 text-xl font-medium text-[#201a14]">
              Your first listing starts here
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756b5e]">
              Add your studio details and help creators find a space that fits their next project.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/add-studio" />}
              className="mt-5 h-10 rounded-full bg-[#f4a000] px-5 text-sm font-semibold text-[#201a14] hover:bg-[#e89400]"
            >
              Add your studio <ArrowRight data-icon="inline-end" />
            </Button>
          </section>
        )}
      </div>
    </main>
  );
}

export default function MyListingsPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading your studio listings"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f3eb]"
        />
      }
    >
      <PrivateMyListingsPage />
    </Suspense>
  );
}
