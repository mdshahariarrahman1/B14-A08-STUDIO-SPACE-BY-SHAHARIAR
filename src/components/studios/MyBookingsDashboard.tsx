"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedbackToast from "@/components/ui/feedback-toast";
import StudioImage from "@/components/studios/StudioImage";
import {
  cancelBooking,
  deleteBooking,
  getMyBookings,
  type BookingRecord,
  type BookingStatus,
} from "@/lib/bookings";

type BookingFilter = "All" | BookingStatus;

const filters: BookingFilter[] = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-[#ffecd1] dark:bg-[#3a2a12] text-[#74400f] dark:text-[#f5cf8d]",
  Confirmed: "bg-[#e0f2e7] dark:bg-[#10301f] text-[#245b3a] dark:text-[#8fe3b4]",
  Completed: "bg-[#e1eff8] dark:bg-[#10283c] text-[#245b7e] dark:text-[#9fcaf5]",
  Cancelled: "bg-[#eee9e1] dark:bg-[#1f1911] text-[#5f574c] dark:text-[#c9bda8]",
};

const dateToneStyles: Record<string, string> = {
  photo: "border-[#dfd0bd] dark:border-[#33291d] bg-[#eadfce] dark:bg-[#1f1911]",
  podcast: "border-[#d0e0e8] dark:border-[#1f3a4c] bg-[#dcecf2] dark:bg-[#10283c]",
  music: "border-[#cfe1d4] dark:border-[#24442e] bg-[#dcefe2] dark:bg-[#10301f]",
  default: "border-[#dfd0bd] dark:border-[#33291d] bg-[#eadfce] dark:bg-[#1f1911]",
};

function getDateTone(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("podcast")) return dateToneStyles.podcast;
  if (normalized.includes("music")) return dateToneStyles.music;
  if (normalized.includes("photo")) return dateToneStyles.photo;
  return dateToneStyles.default;
}

function formatBookingDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimeRange(startTime: string, durationHours: number) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const end = new Date(2000, 0, 1, hours + durationHours, minutes);
  const start = formatTime(startTime);
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${start} – ${endTime} · ${durationHours} ${
    durationHours === 1 ? "hr" : "hrs"
  }`;
}

function getUserInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function BookingCard({
  booking,
  onCancel,
  onDelete,
}: {
  booking: BookingRecord;
  onCancel: (booking: BookingRecord) => void;
  onDelete: (booking: BookingRecord) => void;
}) {
  return (
    <Card className="group h-full min-w-0 gap-0 rounded-[20px] border-[#eee7dc] dark:border-[#33291d] bg-card p-2.5 shadow-[0_6px_18px_rgba(54,39,23,0.04)] ring-0 transition-all hover:-translate-y-0.5 hover:border-[#dfd0bd] dark:border-[#33291d] hover:shadow-[0_12px_28px_rgba(54,39,23,0.09)]">
      <div
        className={`flex min-h-24 items-center gap-2.5 rounded-xl border px-2.5 py-2.5 ${getDateTone(
          booking.studio.category,
        )}`}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-black/5">
          <StudioImage
            src={booking.studioImage}
            alt={booking.studio.title}
            category={booking.studio.category}
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${statusStyles[booking.status]}`}
            >
              <span aria-hidden className="size-1 rounded-full bg-current" />
              {booking.status}
            </span>
            <span className="shrink-0 text-[8px] tracking-wide text-[#62594e] dark:text-[#c9bda8]">
              #{booking.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <p className="mt-3 font-serif text-[19px] leading-none tracking-tight text-[#201a14] dark:text-[#f2eadf]">
            {formatBookingDate(booking.date)}
          </p>
        </div>
      </div>

      <CardHeader className="gap-1 px-1.5 pt-3.5 pb-0">
        <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#bd5b0d] dark:text-[#f0a63c]">
          {booking.studio.category}
        </p>
        <CardTitle className="min-h-10 font-serif text-[17px] font-normal leading-[1.15] tracking-tight text-[#201a14] dark:text-[#f2eadf]">
          {booking.studio.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-1.5 pt-2 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="size-6 shrink-0">
            {booking.user.image ? (
              <AvatarImage
                src={booking.user.image}
                alt={booking.user.name}
              />
            ) : null}
            <AvatarFallback className="bg-[#ffecd1] dark:bg-[#3a2a12] text-[8px] font-semibold text-[#74400f] dark:text-[#f5cf8d]">
              {getUserInitials(booking.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-[9px] leading-tight">
            <p className="truncate font-medium text-[#201a14] dark:text-[#f2eadf]">
              {booking.user.name}
            </p>
            <p className="truncate text-[#756b5e] dark:text-[#a4987f]">{booking.user.email}</p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-[9px] text-[#62594e] dark:text-[#c9bda8]">
          <MapPin aria-hidden className="size-3 shrink-0" />
          <span className="truncate">{booking.studio.location}</span>
        </p>
        <p className="flex items-center gap-1.5 text-[9px] text-[#62594e] dark:text-[#c9bda8]">
          <Clock3 aria-hidden className="size-3 shrink-0" />
          {formatTimeRange(booking.startTime, booking.durationHours)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#ffecd1] dark:bg-[#3a2a12] px-2 py-1 text-[8px] font-medium text-[#74400f] dark:text-[#f5cf8d]">
            ${booking.total} total
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e1eff8] dark:bg-[#10283c] px-2 py-1 text-[8px] font-medium text-[#245b7e] dark:text-[#9fcaf5]">
            <Users aria-hidden className="size-2.5" />
            ${booking.hourlyRate} / hr
          </span>
          <span className="rounded-full bg-[#e0f2e7] dark:bg-[#10301f] px-2 py-1 text-[8px] font-medium text-[#245b3a] dark:text-[#8fe3b4]">
            ${booking.securityDeposit} deposit
          </span>
        </div>
      </CardContent>

      <div className="mt-auto flex items-center gap-1.5 border-t border-[#eee7dc] dark:border-[#33291d] px-1.5 pt-3 pb-1">
        <Button
          nativeButton={false}
          render={
            <Link
              href={`/studio/details/${encodeURIComponent(booking.studioId)}`}
            />
          }
          className="h-8 min-w-0 flex-1 rounded-lg bg-[#201a14] px-2 text-[10px] font-medium text-white hover:bg-[#3b3025]"
        >
          <Eye aria-hidden className="size-3.5" />
          View
        </Button>
        {booking.status === "Pending" ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onCancel(booking)}
            className="h-8 min-w-0 flex-1 rounded-lg border-[#e8e0d5] dark:border-[#33291d] px-2 text-[9px] font-medium text-[#62594e] dark:text-[#c9bda8] hover:border-[#f1d8d2] dark:border-[#4a2724] hover:bg-[#fff5f2] dark:bg-[#331b19] hover:text-[#b34130] dark:text-[#f2937f]"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Delete booking at ${booking.studio.title}`}
          title="Delete booking"
          onClick={() => onDelete(booking)}
          className="size-8 shrink-0 rounded-lg border-[#f1d8d2] dark:border-[#4a2724] text-[#b34130] dark:text-[#f2937f] hover:bg-[#fff5f2] dark:bg-[#331b19]"
        >
          <X aria-hidden className="size-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function MyBookingsDashboard() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedCancelBooking, setSelectedCancelBooking] =
    useState<BookingRecord | null>(null);
  const [selectedDeleteBooking, setSelectedDeleteBooking] =
    useState<BookingRecord | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    let active = true;
    const fetchBookings = async () => {
      try {
        const loadedBookings = await getMyBookings();
        if (active) setBookings(loadedBookings);
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Your bookings could not be loaded. Please try again.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchBookings();
    return () => {
      active = false;
    };
  }, []);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setBookings(await getMyBookings());
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Your bookings could not be loaded. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const visibleBookings = useMemo(
    () =>
      activeFilter === "All"
        ? bookings
        : bookings.filter((booking) => booking.status === activeFilter),
    [activeFilter, bookings],
  );

  const countFor = (filter: BookingFilter) =>
    filter === "All"
      ? bookings.length
      : bookings.filter((booking) => booking.status === filter).length;

  const totalValue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + booking.total, 0);

  const confirmCancellation = async () => {
    if (!selectedCancelBooking) return;

    setIsCancelling(true);
    try {
      const updatedBooking = await cancelBooking(selectedCancelBooking.id);
      setBookings((current) =>
        current.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking,
        ),
      );
      setSelectedCancelBooking(null);
      setToast({
        message: "Booking cancelled successfully.",
        tone: "success",
      });
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "The booking could not be cancelled. Please try again.",
        tone: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmDeletion = async () => {
    if (!selectedDeleteBooking) return;

    setIsDeleting(true);
    try {
      const result = await deleteBooking(selectedDeleteBooking.id);
      setBookings((current) =>
        current.filter((booking) => booking.id !== selectedDeleteBooking.id),
      );
      setSelectedDeleteBooking(null);
      setToast({
        message: result.availabilityUpdated
          ? result.message
          : "Booking deleted, but its time slots could not be released. Please contact support.",
        tone: result.availabilityUpdated ? "success" : "error",
      });
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "The booking could not be deleted. Please try again.",
        tone: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const pendingCount = countFor("Pending");

  return (
    <>
      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c66b20] dark:text-[#f0a63c]">
          Your reservations
        </p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-5xl">
          My <span className="font-serif italic text-[#c66b20] dark:text-[#f0a63c]">bookings</span>
        </h1>
        <p className="mt-3 max-w-md text-xs leading-5 text-[#62594e] dark:text-[#c9bda8]">
          Keep track of your studio reservations, booking times and payment
          details in one place.
        </p>
      </div>

      <section
        aria-label="Booking statistics"
        className="mt-6 grid gap-3 sm:grid-cols-3"
      >
        <Card className="min-h-24 gap-2 rounded-2xl border-[#eee7dc] dark:border-[#33291d] bg-card p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#ffecd1] dark:bg-[#3a2a12] text-[#a75c16] dark:text-[#f0a63c]">
              <CalendarDays aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14] dark:text-[#f2eadf]">
              {isLoading ? "—" : bookings.length}
            </p>
            <p className="text-[10px] text-[#756b5e] dark:text-[#a4987f]">Total bookings</p>
          </CardContent>
        </Card>
        <Card className="min-h-24 gap-2 rounded-2xl border-[#eee7dc] dark:border-[#33291d] bg-card p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e1eff8] dark:bg-[#10283c] text-[#286b98] dark:text-[#9fcaf5]">
              <Clock3 aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14] dark:text-[#f2eadf]">
              {isLoading ? "—" : pendingCount}
            </p>
            <p className="text-[10px] text-[#756b5e] dark:text-[#a4987f]">Pending bookings</p>
          </CardContent>
        </Card>
        <Card className="min-h-24 gap-2 rounded-2xl border-[#eee7dc] dark:border-[#33291d] bg-card p-3.5 shadow-none ring-0">
          <CardContent className="grid gap-2 p-0">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e0f2e7] dark:bg-[#10301f] text-[#247443] dark:text-[#8fe3b4]">
              <CheckCircle2 aria-hidden className="size-3.5" />
            </span>
            <p className="text-xl font-semibold leading-none text-[#201a14] dark:text-[#f2eadf]">
              {isLoading ? "—" : `$${totalValue}`}
            </p>
            <p className="text-[10px] text-[#756b5e] dark:text-[#a4987f]">Active booking value</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 pb-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
            Your <span className="italic text-[#c66b20] dark:text-[#f0a63c]">reservations</span>
          </h2>
          <span className="rounded-full bg-[#ffecd1] dark:bg-[#3a2a12] px-2.5 py-1 text-[9px] font-medium text-[#74400f] dark:text-[#f5cf8d]">
            {isLoading
              ? "Loading"
              : `${visibleBookings.length} ${
                  visibleBookings.length === 1 ? "booking" : "bookings"
                }`}
          </span>
        </div>

        <div
          aria-label="Filter bookings by status"
          className="mt-3 flex flex-wrap gap-2"
        >
          {filters.map((filter) => (
            <Button
              key={filter}
              type="button"
              size="sm"
              variant="outline"
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-7 rounded-full px-3 text-[10px] font-normal ${
                activeFilter === filter
                  ? "border-[#f4a000] bg-[#ffecd1] dark:bg-[#3a2a12] text-[#74400f] dark:text-[#f5cf8d] hover:bg-[#ffecd1] dark:bg-[#3a2a12]"
                  : "border-[#e8e0d5] dark:border-[#33291d] bg-card text-[#201a14] dark:text-[#f2eadf] hover:bg-[#faf7f1] dark:bg-[#1c1610]"
              }`}
            >
              {filter} · {isLoading ? "—" : countFor(filter)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading bookings"
            className="mt-4 grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filters.slice(0, 3).map((filter) => (
              <div
                key={filter}
                className="h-72 rounded-2xl border border-[#eee7dc] dark:border-[#33291d] bg-card/70"
              />
            ))}
          </div>
        ) : loadError ? (
          <Card className="mt-4 gap-3 rounded-2xl border-[#f1d8d2] dark:border-[#4a2724] bg-card px-6 py-10 text-center shadow-none ring-0">
            <CardContent className="p-0">
              <XCircle
                aria-hidden
                className="mx-auto size-8 text-[#b34130] dark:text-[#f2937f]"
              />
              <h3 className="mt-3 font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
                We couldn&apos;t load your bookings
              </h3>
              <p role="alert" className="mt-2 text-sm text-[#756b5e] dark:text-[#a4987f]">
                {loadError}
              </p>
              <Button
                type="button"
                onClick={() => void loadBookings()}
                className="mt-4 rounded-full bg-[#201a14] px-5 text-white hover:bg-[#3b3025]"
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : visibleBookings.length ? (
          <div className="mt-4 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={setSelectedCancelBooking}
                onDelete={setSelectedDeleteBooking}
              />
            ))}
          </div>
        ) : (
          <Card className="mt-4 gap-3 rounded-2xl border-dashed border-[#d9cdbb] dark:border-[#33291d] bg-card px-6 py-12 text-center shadow-none ring-0">
            <CardContent className="p-0">
              <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#fff1d9] dark:bg-[#3a2a12] text-[#9b5b19] dark:text-[#f5cf8d]">
                <CalendarDays aria-hidden className="size-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
                {bookings.length
                  ? `No ${activeFilter.toLowerCase()} bookings`
                  : "No bookings yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756b5e] dark:text-[#a4987f]">
                {bookings.length
                  ? "Choose another filter to see your reservations."
                  : "Explore the studios and book a space for your next creative project."}
              </p>
              {!bookings.length ? (
                <Button
                  nativeButton={false}
                  render={<Link href="/studios" />}
                  className="mt-5 h-9 rounded-full bg-[#f4a000] px-5 text-sm font-semibold text-[#201a14] dark:text-[#201a14] hover:bg-[#e89400]"
                >
                  Explore studios
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </section>

      <Dialog
        open={Boolean(selectedCancelBooking)}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setSelectedCancelBooking(null);
        }}
      >
        <DialogContent className="border-[#eee7dc] dark:border-[#33291d] bg-[#fffdf9] dark:bg-[#1c1610] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
              Cancel this booking?
            </DialogTitle>
            <DialogDescription className="text-[#756b5e] dark:text-[#a4987f]">
              {selectedCancelBooking
                ? `Your reservation at ${selectedCancelBooking.studio.title} on ${formatBookingDate(selectedCancelBooking.date)} will be marked as cancelled.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isCancelling}
              onClick={() => setSelectedCancelBooking(null)}
            >
              Keep booking
            </Button>
            <Button
              type="button"
              disabled={isCancelling}
              onClick={() => void confirmCancellation()}
              className="bg-[#b34130] text-white hover:bg-[#963729]"
            >
              {isCancelling ? "Cancelling…" : "Cancel booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedDeleteBooking)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setSelectedDeleteBooking(null);
        }}
      >
        <DialogContent className="border-[#eee7dc] dark:border-[#33291d] bg-[#fffdf9] dark:bg-[#1c1610] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
              Permanently delete this booking?
            </DialogTitle>
            <DialogDescription className="text-[#756b5e] dark:text-[#a4987f]">
              {selectedDeleteBooking
                ? `This will permanently remove your reservation at ${selectedDeleteBooking.studio.title} on ${formatBookingDate(selectedDeleteBooking.date)}. This action cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setSelectedDeleteBooking(null)}
            >
              Keep booking
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={() => void confirmDeletion()}
              className="bg-[#b34130] text-white hover:bg-[#963729]"
            >
              {isDeleting ? "Deleting…" : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
