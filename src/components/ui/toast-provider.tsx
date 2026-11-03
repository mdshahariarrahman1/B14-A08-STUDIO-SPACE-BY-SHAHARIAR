"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import FeedbackToast from "@/components/ui/feedback-toast";

type ToastTone = "success" | "error";
type ToastContextValue = (message: string, tone: ToastTone) => void;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    tone: ToastTone;
  } | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone) => {
    setToast({ message, tone });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast ? (
        <FeedbackToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={dismissToast}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useAppToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useAppToast must be used within a ToastProvider.");
  }
  return showToast;
}
