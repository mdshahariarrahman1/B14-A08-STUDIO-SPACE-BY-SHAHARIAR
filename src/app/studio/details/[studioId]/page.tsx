import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getStudioById } from "@/lib/studios-server";
import StudioDetailsView from "@/components/studios/StudioDetailsView";

async function StudioDetails({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  const { studioId } = await params;
  const studio = await getStudioById(studioId);

  if (!studio) notFound();

  return <StudioDetailsView studio={studio} />;
}

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading studio details"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f5f0]"
        />
      }
    >
      <StudioDetails params={params} />
    </Suspense>
  );
}
