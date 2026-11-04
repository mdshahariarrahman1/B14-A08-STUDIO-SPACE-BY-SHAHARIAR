import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getStudioById } from "@/lib/studios-server";
import StudioDetailsView from "@/components/studios/StudioDetailsView";

const StudioListing = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await connection();
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
          className="min-h-[calc(100vh-5rem)] animate-pulse bg-[#f7f5f0] dark:bg-[#14100c]"
        />
      }
    >
      <StudioListing params={params} />
    </Suspense>
  );
};

export default StudiosDetailsPage;
