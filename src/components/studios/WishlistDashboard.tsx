"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeedbackToast from "@/components/ui/feedback-toast";
import StudioCard from "@/components/studios/StudioCard";
import { getWishlist, removeItemFromWishlist } from "@/lib/wishlist";
import type { IStudio } from "@/type";

type WishlistToast = {
  message: string;
  tone: "success" | "error";
};

function WishlistCardSkeleton() {
  return (
    <Card className="flex h-100 min-w-0 flex-col gap-0 rounded-2xl border-[#eee7dc] dark:border-[#33291d] bg-card p-2 shadow-none ring-0">
      <div className="h-36 shrink-0 animate-pulse rounded-xl bg-[#eee7dc] sm:h-40" />
      <CardContent className="px-2 pt-4 pb-2">
        <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-[#eee7dc]" />
        <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-[#eee7dc]" />
        <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded-full bg-[#eee7dc]" />
      </CardContent>
      <div className="mt-auto flex gap-2 border-t border-[#eee7dc] dark:border-[#33291d] px-2 pt-3 pb-2">
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-[#eee7dc]" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#eee7dc]" />
      </div>
    </Card>
  );
}

export default function WishlistDashboard() {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toast, setToast] = useState<WishlistToast | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    let active = true;

    const fetchWishlist = async () => {
      try {
        const loadedStudios = await getWishlist();
        if (active) setStudios(loadedStudios);
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Your saved studios could not be loaded. Please try again.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchWishlist();
    return () => {
      active = false;
    };
  }, []);

  const loadWishlist = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setStudios(await getWishlist());
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Your saved studios could not be loaded. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeStudio = async (studio: IStudio) => {
    if (removingId) return;

    setRemovingId(studio._id);
    // Optimistic: drop the card immediately, restore it if the request fails.
    const snapshot = studios;
    setStudios((current) =>
      current.filter((item) => item._id !== studio._id),
    );

    try {
      await removeItemFromWishlist(studio._id);
      setToast({
        message: `${studio.title} was removed from your wishlist.`,
        tone: "success",
      });
    } catch (error) {
      setStudios(snapshot);
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "The studio could not be removed. Please try again.",
        tone: "error",
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c66b20] dark:text-[#f0a63c]">
          Your saved spaces
        </p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-5xl">
          Saved{" "}
          <span className="font-serif italic text-[#c66b20] dark:text-[#f0a63c]">wishlist</span>
        </h1>
        <p className="mt-3 max-w-md text-xs leading-5 text-[#62594e] dark:text-[#c9bda8]">
          {isLoading
            ? "Loading the studios you have saved."
            : studios.length === 0
              ? "Save studios you love and find them here any time."
              : `${studios.length} ${
                  studios.length === 1 ? "studio" : "studios"
                } saved. Remove any studio you no longer need.`}
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <WishlistCardSkeleton key={key} />
            ))}
          </div>
        ) : loadError ? (
          <Card className="mx-auto max-w-md rounded-[20px] border-[#eee7dc] dark:border-[#33291d] bg-card p-8 text-center shadow-[0_6px_18px_rgba(54,39,23,0.04)] ring-0">
            <CardContent className="space-y-4">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#f6e3e0] dark:bg-[#331b19] text-[#b34130] dark:text-[#f2937f]">
                <Heart aria-hidden className="size-6" />
              </span>
              <h2 className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
                Your wishlist could not be loaded
              </h2>
              <p className="text-xs leading-5 text-[#756b5e] dark:text-[#a4987f]">{loadError}</p>
              <Button
                type="button"
                onClick={() => void loadWishlist()}
                className="h-10 rounded-xl bg-[#201a14] px-5 text-sm text-white hover:bg-[#3b3025]"
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : studios.length === 0 ? (
          <div className="mx-auto max-w-md rounded-[28px] border border-[#eee7dc] dark:border-[#33291d] bg-card px-8 py-14 text-center shadow-[0_6px_18px_rgba(54,39,23,0.04)]">
            <div className="relative mx-auto flex size-16 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-[#ffecd1] dark:bg-[#3a2a12]"
              />
              <Heart
                aria-hidden
                className="relative size-8 fill-[#f0b25a] text-[#c66b20] dark:text-[#f0a63c]"
              />
            </div>
            <h2 className="mt-6 text-3xl font-medium tracking-tight text-[#201a14] dark:text-[#f2eadf]">
              Nothing saved{" "}
              <span className="font-serif italic text-[#8a6a4f] dark:text-[#c8ab7f]">yet</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-[#62594e] dark:text-[#c9bda8]">
              Tap the heart on any studio to keep it here for your next
              project.
            </p>
            <Button
              nativeButton={false}
              render={
                <Link
                  href="/studios"
                  aria-label="Explore studios to save to your wishlist"
                />
              }
              className="mt-7 h-11 rounded-xl bg-[#201a14] px-6 text-sm text-white hover:bg-[#3b3025]"
            >
              Explore studios
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                variant="listing"
                action={
                  <Button
                    type="button"
                    onClick={() => void removeStudio(studio)}
                    disabled={removingId !== null}
                    aria-label={`Remove ${studio.title} from your wishlist`}
                    className="h-9 shrink-0 gap-1.5 rounded-lg border border-[#eee7dc] dark:border-[#33291d] bg-card px-3 text-[11px] text-[#b34130] dark:text-[#f2937f] hover:bg-[#f6e3e0] dark:bg-[#331b19] hover:text-[#96362a] dark:text-[#f2937f]"
                  >
                    <Trash2 aria-hidden className="size-3.5" />
                    {removingId === studio._id ? "Removing…" : "Remove"}
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {toast ? (
        <FeedbackToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={dismissToast}
        />
      ) : null}
    </>
  );
}
