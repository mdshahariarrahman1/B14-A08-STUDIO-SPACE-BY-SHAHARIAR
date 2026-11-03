import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import { getCurrentUser } from "@/lib/server-auth";
import { getStudios } from "@/lib/studios-server";
import type { IStudio } from "@/type";

export const metadata: Metadata = {
  title: "My profile | StudioSpace",
  description: "Manage your StudioSpace profile and notification preferences.",
};

async function PrivateProfilePage() {
  await connection();
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login?callbackURL=%2Fprofile");
  }

  let studios: IStudio[] | null = null;
  try {
    studios = await getStudios();
  } catch (error) {
    console.error("Failed to load studios for profile:", error);
  }

  const myStudios = studios?.filter(
    (studio) => studio.ownerEmail?.toLowerCase() === user.email.toLowerCase(),
  );
  const rating =
    myStudios && myStudios.length > 0
      ? myStudios.reduce((sum, studio) => sum + studio.rating, 0) /
        myStudios.length
      : null;

  return (
    <ProfileDashboard
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      stats={
        myStudios
          ? {
              listings: myStudios.length,
              open: myStudios.filter((studio) => studio.isAvailable).length,
              rating,
            }
          : null
      }
    />
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading your profile"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f3eb]"
        />
      }
    >
      <PrivateProfilePage />
    </Suspense>
  );
}
