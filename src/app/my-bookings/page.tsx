import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import MyBookingsDashboard from "@/components/studios/MyBookingsDashboard";
import { getCurrentUser } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "My bookings | StudioSpace",
  description: "Manage your studio reservations and booking requests.",
};

async function PrivateMyBookingsPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login?callbackURL=%2Fmy-bookings");
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f3eb] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-xs text-[#756b5e]">
          <Link
            className="underline underline-offset-2 hover:text-[#201a14]"
            href="/studios"
          >
            Spaces
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span>My bookings</span>
        </nav>

        <MyBookingsDashboard />
      </div>
    </main>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading your bookings"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f3eb]"
        />
      }
    >
      <PrivateMyBookingsPage />
    </Suspense>
  );
}
