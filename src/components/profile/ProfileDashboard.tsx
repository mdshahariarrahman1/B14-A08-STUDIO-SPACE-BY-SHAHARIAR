"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Edit2,
  LogOut,
  Plus,
  SquareLibrary,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FeedbackToast from "@/components/ui/feedback-toast";
import { useAppToast } from "@/components/ui/toast-provider";
import { authClient } from "@/lib/auth-client";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
};

type ProfileStats = {
  listings: number;
  open: number;
  rating: number | null;
};

export default function ProfileDashboard({
  user,
  stats,
}: {
  user: ProfileUser;
  stats: ProfileStats | null;
}) {
  const router = useRouter();
  const showToast = useAppToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    bookingRequests: true,
    shootReminders: false,
  });
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);
  const displayName = user.name.trim() || user.email;
  const initials =
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  const openEditor = () => {
    setName(user.name);
    setImage(user.image ?? "");
    setDialogOpen(true);
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setToast({ message: "Please enter your full name.", tone: "error" });
      return;
    }

    const trimmedImage = image.trim();
    if (trimmedImage) {
      try {
        const imageUrl = new URL(trimmedImage);
        if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
          throw new Error("Please use an HTTP or HTTPS image URL.");
        }
      } catch {
        setToast({
          message: "Enter a valid HTTP or HTTPS image URL.",
          tone: "error",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      const result = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
      });
      if (result.error) {
        throw new Error(result.error.message || "Your profile could not be updated.");
      }

      setDialogOpen(false);
      setToast({ message: "Your profile has been updated.", tone: "success" });
      router.refresh();
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Your profile could not be updated. Please try again.",
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const signOut = async () => {
    setIsLoggingOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error(result.error.message || "You could not be signed out.");
      }
      showToast("You have signed out successfully.", "success");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "You could not be signed out. Please try again.",
        tone: "error",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleNotification = (
    setting: keyof typeof notificationSettings,
  ) => {
    setNotificationSettings((current) => ({
      ...current,
      [setting]: !current[setting],
    }));
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f3eb] dark:bg-[#14100c] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#756b5e] dark:text-[#a4987f]">
          <Link
            className="underline underline-offset-2 hover:text-[#201a14] dark:text-[#f2eadf]"
            href="/studios"
          >
            Spaces
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span>Profile</span>
        </nav>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c66b20] dark:text-[#f0a63c]">
              Account
            </p>
            <h1 className="mt-2 text-5xl font-medium tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-6xl">
              My <span className="font-serif italic text-[#c66b20] dark:text-[#f0a63c]">profile</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#62594e] dark:text-[#c9bda8]">
              Keep your details up to date so creators know who they&apos;re
              booking with.
            </p>
          </div>
          <Button
            onClick={openEditor}
            className="h-12 rounded-xl bg-[#201a14] px-6 text-sm font-semibold text-white hover:bg-[#352a20]"
          >
            <Edit2 aria-hidden className="size-4" />
            Edit profile
          </Button>
        </div>

        <div className="mt-9 grid items-start gap-7 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <Card className="rounded-3xl border-[#eee7de] dark:border-[#33291d] bg-card py-7 shadow-[0_12px_28px_rgba(47,35,20,0.08)] ring-0">
            <CardContent className="px-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24 border-4 border-[#f5dfc2] dark:border-[#33291d] bg-[#201a14]">
                  <AvatarImage src={user.image ?? undefined} alt={displayName} />
                  <AvatarFallback className="bg-[#201a14] font-serif text-3xl text-[#f4dfc3]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 font-serif text-2xl tracking-tight text-[#201a14] dark:text-[#f2eadf]">
                  {displayName}
                </h2>
                <p className="mt-1 max-w-full truncate text-sm text-[#756b5e] dark:text-[#a4987f]">
                  {user.email}
                </p>
                <span className="mt-3 rounded-full bg-[#e6f4eb] dark:bg-[#10301f] px-3 py-1.5 text-xs font-medium text-[#287346] dark:text-[#8fe3b4]">
                  <span aria-hidden className="mr-1">
                    •
                  </span>
                  Studio owner
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 divide-x divide-[#f0ece6] dark:divide-[#33291d] border-t border-[#f0ece6] dark:border-[#33291d] pt-5">
                <div className="text-center">
                  <p className="text-2xl font-semibold leading-7 text-[#201a14] dark:text-[#f2eadf]">
                    {stats?.listings ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-[#756b5e] dark:text-[#a4987f]">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold leading-7 text-[#201a14] dark:text-[#f2eadf]">
                    {stats?.open ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-[#756b5e] dark:text-[#a4987f]">Open</p>
                </div>
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-2xl font-semibold leading-7 text-[#201a14] dark:text-[#f2eadf]">
                    <Star
                      aria-hidden
                      className="size-4 fill-[#d58b23] text-[#d58b23]"
                    />
                    {stats?.rating?.toFixed(1) ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-[#756b5e] dark:text-[#a4987f]">Rating</p>
                </div>
              </div>

              {stats === null && (
                <p className="mt-3 text-center text-xs text-[#8b8175] dark:text-[#a4987f]">
                  Studio totals are temporarily unavailable.
                </p>
              )}

              <div className="mt-5 grid gap-2.5">
                <Button
                  nativeButton={false}
                  render={<Link href="/my-listings" />}
                  variant="outline"
                  className="h-11 rounded-xl border-[#e8dfd3] dark:border-[#33291d] text-sm text-[#201a14] dark:text-[#f2eadf] hover:bg-[#faf7f2] dark:bg-[#1c1610]"
                >
                  <SquareLibrary aria-hidden className="size-4" />
                  View my listings
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/add-studio" />}
                  className="h-11 rounded-xl bg-[#f4a000] text-sm font-semibold text-[#201a14] dark:text-[#201a14] shadow-[0_5px_12px_rgba(244,160,0,0.2)] hover:bg-[#e89400]"
                >
                  <Plus aria-hidden className="size-4" />
                  Add new studio
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-3xl border-[#eee7de] dark:border-[#33291d] bg-card py-6 shadow-none ring-0">
              <CardHeader className="flex flex-row items-center justify-between gap-4 px-6 pb-0">
                <CardTitle className="font-serif text-2xl font-normal tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-3xl">
                  Personal{" "}
                  <span className="italic text-[#c66b20] dark:text-[#f0a63c]">information</span>
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={openEditor}
                  className="h-9 rounded-lg border-[#e8dfd3] dark:border-[#33291d] px-4 text-xs text-[#201a14] dark:text-[#f2eadf] hover:bg-[#faf7f2] dark:bg-[#1c1610]"
                >
                  <Edit2 aria-hidden className="size-3.5" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="px-6 pt-5">
                <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  <ProfileField label="Full name" value={displayName} />
                  <ProfileField label="Email" value={user.email} />
                  <ProfileField label="Phone" value="Not added yet" muted />
                  <ProfileField label="City" value="Dhaka, Bangladesh" />
                  <ProfileField
                    label="Image URL"
                    value={user.image || "Not added yet"}
                    muted={!user.image}
                  />
                </dl>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#eee7de] dark:border-[#33291d] bg-card py-6 shadow-none ring-0">
              <CardHeader className="px-6 pb-0">
                <CardTitle className="font-serif text-2xl font-normal tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-3xl">
                  About <span className="italic text-[#c66b20] dark:text-[#f0a63c]">you</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pt-3">
                <p className="text-sm leading-6 text-[#756b5e] dark:text-[#a4987f]">
                  Your bio is empty. Add a few lines about yourself and the
                  spaces you host.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#eee7de] dark:border-[#33291d] bg-card py-6 shadow-none ring-0">
              <CardHeader className="px-6 pb-0">
                <CardTitle className="font-serif text-2xl font-normal tracking-tight text-[#201a14] dark:text-[#f2eadf] sm:text-3xl">
                  Notification{" "}
                  <span className="italic text-[#c66b20] dark:text-[#f0a63c]">preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pt-3">
                <NotificationToggle
                  checked={notificationSettings.bookingRequests}
                  description="Get an email when someone books one of your studios."
                  label="New booking requests"
                  onCheckedChange={() => toggleNotification("bookingRequests")}
                />
                <NotificationToggle
                  checked={notificationSettings.shootReminders}
                  description="A heads-up the day before a booked session."
                  label="Shoot-day reminders"
                  onCheckedChange={() => toggleNotification("shootReminders")}
                />
              </CardContent>
            </Card>

            <div>
              <Button
                variant="outline"
                onClick={signOut}
                disabled={isLoggingOut}
                className="h-10 rounded-lg border-[#f0d7cf] dark:border-[#4a2724] bg-card px-4 text-xs font-medium text-[#bd4d3e] dark:text-[#f2937f] hover:bg-[#fff7f4] dark:bg-[#331b19]"
              >
                {isLoggingOut ? (
                    <ArrowLeft aria-hidden className="size-3.5" />
                ) : (
                    <LogOut aria-hidden className="size-3.5" />
                )}
                {isLoggingOut ? "Logging out…" : "Log out"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl border-[#eee7de] dark:border-[#33291d]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#201a14] dark:text-[#f2eadf]">
              Edit your profile
            </DialogTitle>
            <DialogDescription>
              Update your name and profile photo. Your email address cannot be
              changed here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveProfile} className="grid gap-4">
            <label className="grid gap-1.5 text-xs font-medium text-[#62594e] dark:text-[#c9bda8]">
              Full name
              <Input
                autoComplete="name"
                maxLength={100}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
                className="h-10 rounded-lg border-[#e8dfd3] dark:border-[#33291d] bg-card"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-[#62594e] dark:text-[#c9bda8]">
              Email
              <Input
                value={user.email}
                readOnly
                className="h-10 rounded-lg border-[#e8dfd3] dark:border-[#33291d] bg-[#faf7f2] dark:bg-[#1c1610] text-[#756b5e] dark:text-[#a4987f]"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-[#62594e] dark:text-[#c9bda8]">
              Image URL
              <Input
                autoComplete="url"
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/photo.jpg"
                type="url"
                value={image}
                className="h-10 rounded-lg border-[#e8dfd3] dark:border-[#33291d] bg-card"
              />
            </label>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#201a14] text-white hover:bg-[#352a20]"
              >
                <Check aria-hidden className="size-4" />
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {toast && (
        <FeedbackToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={dismissToast}
        />
      )}
    </main>
  );
}

function ProfileField({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[#8b8175] dark:text-[#a4987f]">{label}</dt>
      <dd
        className={`mt-1 truncate text-sm ${
          muted ? "text-[#756b5e] dark:text-[#a4987f]" : "text-[#201a14] dark:text-[#f2eadf]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function NotificationToggle({
  checked,
  description,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-t border-[#f0ece6] dark:border-[#33291d] py-4 first:border-t-0">
      <div>
        <p className="text-sm font-medium text-[#201a14] dark:text-[#f2eadf]">{label}</p>
        <p className="mt-1 text-xs text-[#756b5e] dark:text-[#a4987f]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onCheckedChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287346] ${
          checked ? "bg-[#287346]" : "bg-[#928a7e]"
        }`}
      >
        <span
          className={`size-4.5 rounded-full bg-card shadow-sm transition-transform ${
            checked ? "translate-x-5.5" : "translate-x-0.75"
          }`}
        />
      </button>
    </div>
  );
}
