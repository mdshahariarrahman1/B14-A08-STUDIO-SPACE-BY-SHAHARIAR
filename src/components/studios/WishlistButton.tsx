"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import FeedbackToast from "@/components/ui/feedback-toast";
import { useSession } from "@/lib/auth-client";
import {
  addItemToWishlist,
  getWishlistStatus,
  removeItemFromWishlist,
} from "@/lib/wishlist";
import { cn } from "@/lib/utils";

type WishlistToast = {
  message: string;
  tone: "success" | "error";
};

const WishlistButton = ({
  studioId,
  studioTitle,
}: {
  studioId: string;
  studioTitle: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = useSession();
  // null means the server state has not been resolved yet.
  const [saved, setSaved] = useState<boolean | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [toast, setToast] = useState<WishlistToast | null>(null);

  const userEmail = session?.user?.email ?? null;

  useEffect(() => {
    if (!userEmail) return;

    let isCurrent = true;

    getWishlistStatus(studioId)
      .then((status) => {
        if (isCurrent) setSaved(status);
      })
      .catch(() => {
        // Leave the heart unloaded; toggle errors surface their own toast.
      });

    return () => {
      isCurrent = false;
    };
  }, [studioId, userEmail]);

  // Derived on render: signed-out users always see an unsaved heart.
  const isSaved = Boolean(userEmail) && saved === true;

  const ariaLabel = isSaved
    ? `Remove ${studioTitle} from your wishlist`
    : `Save ${studioTitle} to your wishlist`;

  const handleToggle = async () => {
    if (isSessionPending || isMutating) return;

    if (!userEmail) {
      const callbackURL =
        pathname?.startsWith("/") && !pathname.startsWith("//")
          ? pathname
          : `/studios/${encodeURIComponent(studioId)}`;

      router.push(`/login?callbackURL=${encodeURIComponent(callbackURL)}`);
      return;
    }

    const nextSaved = !isSaved;
    setSaved(nextSaved);
    setIsMutating(true);

    try {
      if (nextSaved) {
        await addItemToWishlist(studioId);
        setToast({
          message: `${studioTitle} saved to your wishlist.`,
          tone: "success",
        });
      } else {
        await removeItemFromWishlist(studioId);
        setToast({
          message: `${studioTitle} removed from your wishlist.`,
          tone: "success",
        });
      }
    } catch (error) {
      setSaved(!nextSaved);
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Your wishlist could not be updated. Please try again.",
        tone: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleToggle()}
        aria-label={ariaLabel}
        aria-pressed={isSaved}
        disabled={isSessionPending || isMutating}
        className={cn(
          "absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-card/90 shadow-sm outline-none backdrop-blur-sm transition duration-200 sm:right-4 sm:top-4 sm:size-11",
          "hover:bg-card focus-visible:ring-2 focus-visible:ring-[#F0A63C]/40",
          (isSessionPending || isMutating) && "cursor-wait opacity-90",
        )}
      >
        <Heart
          aria-hidden
          className={cn(
            "size-5 transition-colors duration-200",
            isSaved
              ? "fill-[#c9556e] text-[#c9556e] dark:text-[#f2a0a8]"
              : "fill-transparent text-[#453a2e] dark:text-[#f2eadf]",
            isSessionPending && !isMutating && "opacity-50",
          )}
        />
      </button>

      {toast ? (
        <FeedbackToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </>
  );
};

export default WishlistButton;
