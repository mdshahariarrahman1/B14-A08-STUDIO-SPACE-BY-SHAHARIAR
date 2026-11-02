import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import AddStudioForm from "@/components/studios/AddStudioForm";
import { getCurrentUser } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Add a studio | StudioSpace",
  description: "Create a listing for your creative studio on StudioSpace.",
};

async function PrivateAddStudioPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login?callbackURL=%2Fadd-studio");
  }

  return (
    <AddStudioForm
      owner={{
        name: user.name?.trim() || user.email,
        email: user.email,
      }}
    />
  );
}

export default function AddStudioPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading add studio form"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f3eb]"
        />
      }
    >
      <PrivateAddStudioPage />
    </Suspense>
  );
}
