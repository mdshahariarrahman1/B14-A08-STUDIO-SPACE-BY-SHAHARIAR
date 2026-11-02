import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MyListingsDashboard from "@/components/studios/MyListingsDashboard";
import { getCurrentUser } from "@/lib/server-auth";
import { getStudios } from "@/lib/studios";

export const metadata: Metadata = {
  title: "My listings | StudioSpace",
  description: "Manage the studios you have listed on StudioSpace.",
};

async function PrivateMyListingsPage() {
  await connection();
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

        <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c66b20]">
              Host dashboard
            </p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-[#201a14] sm:text-5xl">
              My <span className="font-serif italic text-[#c66b20]">listings</span>
            </h1>
            <p className="mt-3 max-w-md text-xs leading-5 text-[#62594e]">
              Every studio you&apos;ve added, in one place. Review the details, update them or take a listing down.
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

        <MyListingsDashboard studios={myStudios} />
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
