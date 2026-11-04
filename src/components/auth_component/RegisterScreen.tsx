"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppToast } from "@/components/ui/toast-provider";
import { authClient, signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import AuthBrandHeader from "./AuthBrandHeader";
import PasswordChecklist, { buildPasswordChecks } from "./PasswordChecklist";

const STEPS = [
  {
    number: "01",
    label: "Discover spaces",
    badgeClass: "bg-[#F5D9A5] dark:bg-[#3a2a12] text-[#8A5A00] dark:text-[#f5cf8d]",
  },
  {
    number: "02",
    label: "Select shoot hours",
    badgeClass: "bg-[#BFDFF2] dark:bg-[#10283c] text-[#155E75] dark:text-[#9fcaf5]",
  },
  {
    number: "03",
    label: "Book instantly",
    badgeClass: "bg-[#C9E8D2] dark:bg-[#10301f] text-[#166534] dark:text-[#8fe3b4]",
  },
  {
    number: "04",
    label: "Create & produce",
    badgeClass: "bg-[#DCD2F5] dark:bg-[#2b2140] text-[#5B21B6] dark:text-[#c9aff2]",
  },
] as const;

const RegisterScreen = () => {
  const router = useRouter();
  const showToast = useAppToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordChecks = buildPasswordChecks(password);
  const isPasswordValid = passwordChecks.every((check) => check.met);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhotoUrl = photoUrl.trim();

    if (!trimmedName || !trimmedEmail || !isPasswordValid) {
      const message =
        "Please fill in your name and email and meet every password rule.";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        email: trimmedEmail,
        password,
        name: trimmedName,
        ...(trimmedPhotoUrl ? { image: trimmedPhotoUrl } : {}),
      });

      if (error) {
        const message =
          error.message ?? "Registration failed. Please try again.";
        setErrorMessage(message);
        showToast(message, "error");
        return;
      }

      showToast("Your account has been created successfully.", "success");
      const callbackURL = new URLSearchParams(window.location.search).get(
        "callbackURL",
      );
      router.push(
        callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
          ? callbackURL
          : "/",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);

    const callbackURL = new URLSearchParams(window.location.search).get(
      "callbackURL",
    );
    const safeCallbackURL =
      callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
        ? callbackURL
        : "/";

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: safeCallbackURL,
      });

      if (error) {
        showToast(error.message ?? "Google sign-up failed. Please try again.", "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Google sign-up failed. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#14100c] lg:grid lg:grid-cols-2">
      {/* Left column: brand header + form */}
      <div className="mx-auto w-full max-w-150 px-6 pb-14 pt-7 sm:px-10 lg:mx-0 lg:max-w-none lg:px-16 lg:pb-16 lg:pt-9 xl:px-20">
        <AuthBrandHeader />

        <form onSubmit={handleSubmit} noValidate className="mt-16 lg:mt-24">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7B4F] dark:text-[#c8ab7f]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#C08552]"
            />
            New account
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight text-[#141414] dark:text-[#f2eadf] sm:text-5xl">
            Register{" "}
            <span className="font-medium italic text-[#8A6F52] dark:text-[#c8ab7f]">
              your account.
            </span>
          </h1>

          <p className="mt-4 max-w-sm text-base leading-relaxed text-[#5B5347] dark:text-[#c9bda8]">
            Create your account to book studios or list your own space.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="register-name"
                className="mb-2 block text-sm font-semibold text-[#141414] dark:text-[#f2eadf]"
              >
                Name
              </label>
              <Input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={
                  hasAttemptedSubmit && !name.trim() ? true : undefined
                }
                className="h-12 rounded-xl border-border bg-card px-4 text-base text-[#141414] dark:text-[#f2eadf] shadow-sm placeholder:text-muted-foreground focus-visible:border-[#F0A63C] focus-visible:ring-[#F5D9A5] dark:ring-[#7a5320] md:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-semibold text-[#141414] dark:text-[#f2eadf]"
              >
                Email
              </label>
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={
                  hasAttemptedSubmit && !email.trim() ? true : undefined
                }
                className="h-12 rounded-xl border-border bg-card px-4 text-base text-[#141414] dark:text-[#f2eadf] shadow-sm placeholder:text-muted-foreground focus-visible:border-[#F0A63C] focus-visible:ring-[#F5D9A5] dark:ring-[#7a5320] md:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="register-photo-url"
                className="mb-2 block text-sm font-semibold text-[#141414] dark:text-[#f2eadf]"
              >
                Photo URL
              </label>
              <Input
                id="register-photo-url"
                name="photoUrl"
                type="text"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
                className="h-12 rounded-xl border-border bg-card px-4 text-base text-[#141414] dark:text-[#f2eadf] shadow-sm placeholder:text-muted-foreground focus-visible:border-[#F0A63C] focus-visible:ring-[#F5D9A5] dark:ring-[#7a5320] md:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-semibold text-[#141414] dark:text-[#f2eadf]"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={
                    hasAttemptedSubmit && !isPasswordValid ? true : undefined
                  }
                  className="h-12 rounded-xl border-border bg-card px-4 pr-16 text-base text-[#141414] dark:text-[#f2eadf] shadow-sm placeholder:text-muted-foreground focus-visible:border-[#F0A63C] focus-visible:ring-[#F5D9A5] dark:ring-[#7a5320] md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-[#6B6459] dark:text-[#c9bda8] transition-colors hover:text-[#141414] dark:text-[#f2eadf]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="mt-3.5">
                <PasswordChecklist checks={passwordChecks} />
              </div>
            </div>
          </div>

          {errorMessage ? (
            <p role="alert" className="mt-5 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 h-12 w-full rounded-xl bg-[#F0A63C] text-base font-semibold text-[#141414] dark:text-[#201a14] shadow-[0_14px_34px_-10px_rgba(240,166,60,0.55)] transition-colors hover:bg-[#E2962B] sm:mt-6"
          >
            {isSubmitting ? "Creating account…" : "Register"}
          </Button>

          <div
            aria-hidden="true"
            className="mt-7 flex items-center gap-4 sm:gap-5"
          >
            <span className="h-px flex-1 bg-[#E3DDD2]" />
            <span className="text-sm text-[#6B6459] dark:text-[#c9bda8]">or</span>
            <span className="h-px flex-1 bg-[#E3DDD2]" />
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isSubmitting}
            className="mt-7 h-12 w-full rounded-xl border-[#DDD5C7] dark:border-[#33291d] bg-card text-base font-semibold text-[#141414] dark:text-[#f2eadf] shadow-sm hover:bg-[#FAF8F3] dark:bg-[#14100c] sm:mt-6"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.8-1.8-5.6-4.2H3v2.7A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#FBBC05"
                d="M6.4 13.8a6 6 0 0 1 0-3.6V7.5H3a10 10 0 0 0 0 9l3.4-2.7Z"
              />
              <path
                fill="#EA4335"
                d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-9 5.5l3.4 2.7C7.2 7.8 9.4 6 12 6Z"
              />
            </svg>
            {isSubmitting ? "Connecting to Google…" : "Sign up with Google"}
          </Button>

          <p className="mt-6 text-center text-sm text-[#5B5347] dark:text-[#c9bda8]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#141414] dark:text-[#f2eadf] underline underline-offset-4 hover:text-[#8A6F52] dark:text-[#c8ab7f]"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>

      {/* Right column: dark steps panel */}
      <aside className="px-6 pb-12 sm:px-10 lg:px-0 lg:py-9 lg:pb-16 lg:pl-0 lg:pr-12 xl:pr-16">
        <div className="flex h-full flex-col rounded-3xl bg-[#2A1E13] px-6 py-9 sm:px-10 lg:px-14 lg:py-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#E9DFCE]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#E9DFCE]"
            />
            Frictionless booking
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-tight text-[#FDF9F2] sm:text-4xl">
            <span className="block">Four steps from</span>
            <span className="block italic text-[#E7D3B8]">
              concept to camera.
            </span>
          </h2>

          <ul className="mt-9 space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="flex items-center gap-4 rounded-2xl border border-[#4A3724] bg-[#382818] px-3.5 py-3.5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-lg text-sm font-bold",
                    step.badgeClass,
                  )}
                >
                  {step.number}
                </span>
                <span className="text-base font-medium text-[#FDF9F2]">
                  {step.label}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-auto max-w-lg pt-12 text-sm leading-relaxed text-[#CBBFAD] lg:pt-16">
            Hosts get live calendars, collision-free bookings and instant
            confirmations. Creators get studio-grade spaces with no surprise
            fees.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default RegisterScreen;
