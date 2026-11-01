import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getStudioById } from "@/lib/studios";
import StudioDetailsView from "@/components/studios/StudioDetailsView";

const StudioListing = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const studio = await getStudioById(id);

  if (!studio) {
    notFound();
  }

  return <StudioDetailsView studio={studio} />;
};

const StudiosDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Loading studio details"
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f5f0]"
        />
      }
    >
      <StudioListing params={params} />
    </Suspense>
  );
};

export default StudiosDetailsPage;
