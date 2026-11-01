"use client";

import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBooking } from "@/lib/bookings";
import type { IStudio } from "@/type";

const START_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
const MAX_HOURS = 8;

function formatDisplayDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isDateInPast(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(`${date}T00:00:00`).getTime() < today.getTime();
}

const BookingWidget = ({ studio }: { studio: IStudio }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("11:00");
  const [duration, setDuration] = useState(2);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    date: string;
    startTime: string;
    duration: number;
    total: number;
  } | null>(null);

  const subtotal = studio.hourlyRate * duration;
  const total = subtotal + studio.securityDeposit;

  const handleBook = async () => {
    if (!date) {
      setError("Please pick a shoot date first.");
      return;
    }

    if (isDateInPast(date)) {
      setError("Please pick today's date or later.");
      return;
    }


    setIsPending(true);
    setError(null);

    try {
      await createBooking({
        studioId: studio._id,
        date,
        startTime,
        durationHours: duration,
        total,
      });
      setConfirmedBooking({ date, startTime, duration, total });
      setConfirmationOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while booking. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-black/8">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-neutral-900">
            ${studio.hourlyRate}
            <span className="ml-1 text-base font-normal text-neutral-500">
              / hour
            </span>
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Live availability
          </span>
        </div>

        <div className="mt-5 h-px bg-neutral-100" />

        {/* Shoot date */}
        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold text-neutral-900">Shoot date</p>
          <Input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setError(null);
            }}
            aria-label="Shoot date"
            className="h-11 rounded-xl bg-white text-neutral-900"
          />
        </div>

        {/* Start time */}
        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold text-neutral-900">Start time</p>
          <div className="grid grid-cols-3 gap-2">
            {START_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setStartTime(slot)}
                aria-pressed={startTime === slot}
                className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
                  startTime === slot
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Duration</p>
            <p className="text-xs text-neutral-500">
              Up to {studio.maxCapacity} people
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDuration((current) => current - 1)}
              disabled={duration <= 1}
              aria-label="Decrease duration"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-800 transition-colors hover:border-neutral-400 disabled:pointer-events-none disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-16 text-center text-sm font-semibold text-neutral-900">
              {duration} {duration === 1 ? "hour" : "hours"}
            </span>
            <button
              type="button"
              onClick={() => setDuration((current) => current + 1)}
              disabled={duration >= MAX_HOURS}
              aria-label="Increase duration"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-800 transition-colors hover:border-neutral-400 disabled:pointer-events-none disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="my-5 h-px bg-neutral-100" />

        {/* Price breakdown */}
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-neutral-600">
              ${studio.hourlyRate} × {duration}{" "}
              {duration === 1 ? "hour" : "hours"}
            </dt>
            <dd className="font-medium text-neutral-900">${subtotal}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-600">Security deposit</dt>
            <dd className="font-medium text-neutral-900">
              ${studio.securityDeposit}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-600">Service fees</dt>
            <dd className="font-medium text-neutral-900">None</dd>
          </div>
        </dl>

        <div className="my-4 h-px bg-neutral-100" />

        <div className="flex items-center justify-between">
          <p className="font-semibold text-neutral-900">Total due</p>
          <p className="text-lg font-semibold text-neutral-900">${total}</p>
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button
          onClick={handleBook}
          disabled={isPending}
          className="mt-4 h-11 w-full rounded-xl bg-[#F0A63C] text-base font-semibold text-[#141414] hover:bg-[#E2962B]"
        >
          {isPending ? "Booking…" : "Book instantly"}
          {isPending ? null : <ArrowRight className="size-4" />}
        </Button>

        <p className="mt-3 text-center text-xs text-neutral-500">
          You won&apos;t be charged until the host confirms.
        </p>
      </div>

      {/* Success confirmation */}
      <Dialog
        open={confirmationOpen}
        onOpenChange={(open) => {
          setConfirmationOpen(Boolean(open));
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Booking requested 🎉</DialogTitle>
            <DialogDescription>
              {confirmedBooking ? (
                <>
                  {studio.title} · {formatDisplayDate(confirmedBooking.date)} at{" "}
                  {confirmedBooking.startTime} · {confirmedBooking.duration}{" "}
                  {confirmedBooking.duration === 1 ? "hour" : "hours"} · $
                  {confirmedBooking.total} total
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-neutral-600">
            The host has {studio.ownerName}&apos;s contact details. You
            won&apos;t be charged until they confirm.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingWidget;
