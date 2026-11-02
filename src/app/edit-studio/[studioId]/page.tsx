import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import AddStudioForm from "@/components/studios/AddStudioForm";
import { getCurrentUser } from "@/lib/server-auth";
import { getStudioById } from "@/lib/studios";

export const metadata: Metadata = {
  title: "Edit studio | StudioSpace",
  description: "Update the details of your StudioSpace listing.",
};

async function PrivateEditStudioPage({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  const { studioId } = await params;
  await connection();
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect(
      `/login?callbackURL=${encodeURIComponent(`/edit-studio/${studioId}`)}`,
    );
  }

  const studio = await getStudioById(studioId);
  if (
    !studio ||
    studio.ownerEmail?.trim().toLowerCase() !== user.email.trim().toLowerCase()
  ) {
    notFound();
  }

  return (
    <AddStudioForm
      owner={{
        name: user.name?.trim() || user.email,
        email: user.email,
      }}
      studio={studio}
    />
  );
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading edit studio form"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f3eb]"
        />
      }
    >
      <PrivateEditStudioPage params={params} />
    </Suspense>
  );
}
