"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudioImage from "@/components/studios/StudioImage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STUDIO_CATEGORIES } from "@/lib/studio-options";
import type { IStudio } from "@/type";
import FeedbackToast from "@/components/ui/feedback-toast";

const categoryBackgrounds: Record<string, string> = {
  "Photo Studio": "bg-[#eadfce] dark:bg-[#1f1911]",
  "Podcast Lounge": "bg-[#dcecf2] dark:bg-[#10283c]",
  "Film Stage": "bg-[#e8dff0] dark:bg-[#2b2140]",
  "Music Suite": "bg-[#dcefe2] dark:bg-[#10301f]",
  Workshop: "bg-[#f1e7d2] dark:bg-[#1f1911]",
};

export default function MyListingsDashboard({
  studios,
}: {
  studios: IStudio[];
}) {
  const router = useRouter();
  const [deletedStudioIds, setDeletedStudioIds] = useState<Set<string>>(
    () => new Set(),
  );
  const studioItems = studios.filter(
    (studio) => !deletedStudioIds.has(studio._id),
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingStudioId, setDeletingStudioId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IStudio | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const categories = useMemo(
    () =>
      STUDIO_CATEGORIES.filter((category) =>
        studioItems.some((studio) => studio.category === category),
      ),
    [studioItems],
  );
  const visibleStudios =
    selectedCategory === "All"
      ? studioItems
      : studioItems.filter((studio) => studio.category === selectedCategory);
  const openStudios = studioItems.filter((studio) => studio.isAvailable).length;
  const averageRate = studioItems.length
    ? Math.round(
        studioItems.reduce((total, studio) => total + studio.hourlyRate, 0) /
          studioItems.length,
      )
    : 0;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const studio = deleteTarget;
    setDeletingStudioId(studio._id);
    try {
      const response = await fetch(
        `/api/studios/${encodeURIComponent(studio._id)}`,
        { method: "DELETE" },
      );
      let result: unknown = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "Could not delete the studio listing. Please try again.";
        throw new Error(message);
      }

      setDeletedStudioIds((current) => new Set(current).add(studio._id));
      setDeleteTarget(null);
      setToast({ message: "Studio listing deleted.", tone: "success" });
      router.refresh();
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Could not delete the studio listing. Please try again.",
        tone: "error",
      });
    } finally {
      setDeletingStudioId(null);
    }
  };

  return (
    <>
      <section aria-label="Listing statistics" className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card className="min-h-24 gap-2 rounded-xl border-[#eee7dc] dark:border-[#33291d] bg-card p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#ffecd1] dark:bg-[#3a2a12] text-[#a75c16] dark:text-[#f0a63c]">
              <Camera aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14] dark:text-[#f2eadf]">{studioItems.length}</p>
            <p className="text-[11px] text-[#756b5e] dark:text-[#a4987f]">Total listings</p>
          </CardContent>
        </Card>
        <Card className="min-h-24 gap-2 rounded-xl border-[#eee7dc] dark:border-[#33291d] bg-card p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e0f2e7] dark:bg-[#10301f] text-[#247443] dark:text-[#8fe3b4]">
              <CheckCircle2 aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14] dark:text-[#f2eadf]">{openStudios}</p>
            <p className="text-[11px] text-[#756b5e] dark:text-[#a4987f]">Open for booking</p>
          </CardContent>
        </Card>
        <Card className="min-h-24 gap-2 rounded-xl border-[#eee7dc] dark:border-[#33291d] bg-card p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e1eff8] dark:bg-[#10283c] text-[#286b98] dark:text-[#9fcaf5]">
              <Clock3 aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14] dark:text-[#f2eadf]">${averageRate}</p>
            <p className="text-[11px] text-[#756b5e] dark:text-[#a4987f]">Average hourly rate</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
            Your <span className="italic text-[#c66b20] dark:text-[#f0a63c]">studios</span>
          </h2>
          <span className="rounded-full bg-[#ffecd1] dark:bg-[#3a2a12] px-2.5 py-1 text-[10px] font-medium text-[#74400f] dark:text-[#f5cf8d]">
            {visibleStudios.length} {visibleStudios.length === 1 ? "listing" : "listings"}
          </span>
        </div>

        <div aria-label="Filter by category" className="mt-3 flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant="outline"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`h-7 rounded-full px-3 text-[10px] font-normal ${
                selectedCategory === category
                  ? "border-[#f4a000] bg-[#ffecd1] dark:bg-[#3a2a12] text-[#74400f] dark:text-[#f5cf8d] hover:bg-[#ffecd1] dark:bg-[#3a2a12]"
                  : "border-[#e8e0d5] dark:border-[#33291d] bg-card text-[#201a14] dark:text-[#f2eadf] hover:bg-[#faf7f1] dark:bg-[#1c1610]"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {visibleStudios.length ? (
          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => (
              <Card
                key={studio._id}
                className="flex h-100 min-w-0 flex-col gap-0 rounded-2xl border-[#eee7dc] dark:border-[#33291d] bg-card p-2 shadow-none ring-0"
              >
                <div className={`relative h-36 shrink-0 overflow-hidden rounded-xl sm:h-40 ${categoryBackgrounds[studio.category] ?? "bg-[#eadfce] dark:bg-[#1f1911]"}`}>
                  <StudioImage
                    src={studio.imageUrl}
                    alt={studio.title}
                    category={studio.category}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span
                    className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${
                      studio.isAvailable
                        ? "bg-[#e0f2e7] dark:bg-[#10301f] text-[#247443] dark:text-[#8fe3b4]"
                        : "bg-[#eee9e1] dark:bg-[#1f1911] text-[#5f574c] dark:text-[#c9bda8]"
                    }`}
                  >
                    <span aria-hidden className="size-1 rounded-full bg-current" />
                    {studio.isAvailable ? "Available for booking" : "Paused"}
                  </span>
                </div>

                <CardHeader className="min-h-29 gap-1 px-2 pt-4 pb-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#bd5b0d] dark:text-[#f0a63c]">
                    {studio.category}
                  </p>
                  <CardTitle className="line-clamp-1 min-h-5 truncate font-serif text-base font-normal leading-snug text-[#201a14] dark:text-[#f2eadf]">
                    {studio.title}
                  </CardTitle>
                  <p className="flex items-center gap-1 truncate text-[10px] text-[#756b5e] dark:text-[#a4987f]">
                    <MapPin aria-hidden className="size-3 shrink-0" />
                    {studio.location}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-[#201a14] dark:text-[#f2eadf]">
                    <Star aria-hidden className="size-3 fill-[#c8831d] text-[#c8831d]" />
                    {studio.reviewCount > 0
                      ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)`
                      : "No reviews yet"}
                  </p>
                </CardHeader>

                <CardContent className="flex min-h-12 flex-wrap content-start gap-1.5 px-2 pt-3 pb-2">
                  <span className="rounded-full bg-[#ffecd1] dark:bg-[#3a2a12] px-2 py-1 text-[9px] font-medium text-[#74400f] dark:text-[#f5cf8d]">
                    ${studio.hourlyRate} / hour
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e1eff8] dark:bg-[#10283c] px-2 py-1 text-[9px] font-medium text-[#245b7e] dark:text-[#9fcaf5]">
                    <Users aria-hidden className="size-2.5" />
                    {studio.maxCapacity} people
                  </span>
                  <span className="rounded-full bg-[#e0f2e7] dark:bg-[#10301f] px-2 py-1 text-[9px] font-medium text-[#245b3a] dark:text-[#8fe3b4]">
                    ${studio.securityDeposit} deposit
                  </span>
                </CardContent>

                <CardFooter className="mt-auto gap-2 border-t border-[#eee7dc] dark:border-[#33291d] bg-transparent px-2 pt-3 pb-2">
                  <Button
                    nativeButton={false}
                    render={<Link href={`/studios/${encodeURIComponent(studio._id)}`} />}
                    className="h-9 flex-1 gap-2 rounded-lg bg-[#201a14] px-2 text-[11px] text-white hover:bg-[#3b3025]"
                  >
                    <Eye aria-hidden className="size-4" />
                    View
                  </Button>
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        href={`/edit-studio/${encodeURIComponent(studio._id)}`}
                      />
                    }
                    variant="outline"
                    aria-label={`Edit ${studio.title}`}
                    className="h-9 flex-1 gap-2 rounded-lg border-[#e8e0d5] dark:border-[#33291d] px-2 text-[11px] font-normal"
                  >
                    <Pencil aria-hidden className="size-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={deletingStudioId !== null}
                    onClick={() => setDeleteTarget(studio)}
                    title="Delete this listing"
                    aria-label={`Delete ${studio.title}`}
                    className="size-9 rounded-lg border-[#f1d8d2] dark:border-[#4a2724] text-[#b34130] dark:text-[#f2937f]"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-4 gap-3 rounded-2xl border-dashed border-[#d9cdbb] dark:border-[#33291d] bg-card px-6 py-12 text-center shadow-none ring-0">
            <CardContent className="p-0">
              <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#fff1d9] dark:bg-[#3a2a12] text-[#9b5b19] dark:text-[#f5cf8d]">
                <Plus aria-hidden className="size-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
                {studioItems.length
                  ? "No studios in this category"
                  : "Your first listing starts here"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756b5e] dark:text-[#a4987f]">
                {studioItems.length
                  ? "Choose another category to see your studio listings."
                  : "Add your studio details and help creators find a space that fits their next project."}
              </p>
              {!studioItems.length ? (
                <Button
                  nativeButton={false}
                  render={<Link href="/add-studio" />}
                  className="mt-5 h-9 rounded-full bg-[#f4a000] px-5 text-sm font-semibold text-[#201a14] dark:text-[#201a14] hover:bg-[#e89400]"
                >
                  Add your studio <Plus aria-hidden className="size-4" />
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </section>
      {toast && (
        <FeedbackToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={dismissToast}
        />
      )}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && deletingStudioId === null) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="rounded-2xl border-[#eee7de] dark:border-[#33291d]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
              Delete this studio?
            </DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `"${deleteTarget.title}" will be permanently removed from your listings.`
                : "This studio will be permanently removed from your listings."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deletingStudioId !== null}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingStudioId !== null}
              onClick={() => void handleDelete()}
            >
              <Trash2 aria-hidden className="size-4" />
              {deletingStudioId ? "Deleting…" : "Delete studio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
