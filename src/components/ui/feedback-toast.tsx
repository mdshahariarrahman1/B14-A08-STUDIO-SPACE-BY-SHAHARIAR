"use client";

import { useEffect } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

export default function FeedbackToast({
  message,
  tone,
  onDismiss,
}: {
  message: string;
  tone: "success" | "error";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  const Icon = tone === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      role={tone === "success" ? "status" : "alert"}
      aria-live={tone === "success" ? "polite" : "assertive"}
      className={`fixed right-4 bottom-4 z-70 flex max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg ${
        tone === "success"
          ? "border-[#cfe1d4] text-[#245b3a]"
          : "border-red-200 text-red-700"
      }`}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-current/70 hover:bg-black/5 hover:text-current"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}
