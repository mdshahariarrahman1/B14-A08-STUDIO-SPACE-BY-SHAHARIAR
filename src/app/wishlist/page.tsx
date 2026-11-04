import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import WishlistDashboard from "@/components/studios/WishlistDashboard";
import { getCurrentUser } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Saved wishlist | StudioSpace",
  description: "View and manage the studios you saved for later.",
};

async function PrivateWishlistPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login?callbackURL=%2Fwishlist");
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f3eb] dark:bg-[#14100c] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-xs text-[#756b5e] dark:text-[#a4987f]">
          <Link
            className="underline underline-offset-2 hover:text-[#201a14] dark:text-[#f2eadf]"
            href="/studios"
          >
            Spaces
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span>Saved wishlist</span>
        </nav>

        <WishlistDashboard />
      </div>
    </main>
  );
}

export default function WishlistPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading your saved studios"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f3eb] dark:bg-[#14100c]"
        />
      }
    >
      <PrivateWishlistPage />
    </Suspense>
  );
}
