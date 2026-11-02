"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FeedbackToast from "@/components/ui/feedback-toast";
import { Input } from "@/components/ui/input";
import { authClient, signIn } from "@/lib/auth-client";
import AuthBrandHeader from "./AuthBrandHeader";

const HIGHLIGHTS = [
  "Verified spaces with live availability",
  "Transparent hourly rates, zero surprise fees",
  "Instant confirmation and invoice vouchers",
] as const;

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message ??
            "Invalid email or password. Please try again.",
        );
        return;
      }

      const callbackURL = new URLSearchParams(window.location.search).get(
        "callbackURL",
      );
      router.push(
        callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
          ? callbackURL
          : "/",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
      });

      if (error) {
        setToast(error.message ?? "Google sign-in failed. Please try again.");
      }
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] lg:grid lg:grid-cols-2">
      {/* Left column: brand header + form */}
      <div className="mx-auto w-full max-w-150 px-6 pb-14 pt-7 sm:px-10 lg:mx-0 lg:max-w-none lg:px-16 lg:pb-16 lg:pt-9 xl:px-20">
        <AuthBrandHeader />

        <form onSubmit={handleSubmit} noValidate className="mt-16 lg:mt-24">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7B4F]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#C08552]"
            />
            Welcome back
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight text-[#141414] sm:text-5xl">
            Login{" "}
            <span className="font-medium italic text-[#8A6F52]">
              to your account.
            </span>
          </h1>

          <p className="mt-4 max-w-sm text-base leading-relaxed text-[#5B5347]">
            Log in to manage your bookings and find your next studio.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold text-[#141414]"
              >
                Email
              </label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={
                  hasAttemptedSubmit && !email.trim() ? true : undefined
                }
                className="h-12 rounded-xl border-neutral-300 bg-white px-4 text-base text-[#141414] shadow-sm placeholder:text-neutral-400 focus-visible:border-[#F0A63C] focus-visible:ring-[#F5D9A5] md:text-base"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-[#141414]"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-[#8A6F52] underline underline-offset-4 transition-colors hover:text-[#141414]"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={
                    hasAttemptedSubmit && !password ? true : undefined
                  }
                  className="h-12 rounded-xl border-neutral-300 bg-white px-4 pr-16 text-base text-[#141414] shadow-sm placeholder:text-neutral-400 focus-visible:border-[#F0A63C] focus-visible:ring-[#F5D9A5] md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 z-10 flex items-center text-sm font-medium text-[#6B6459] transition-colors hover:text-[#141414]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
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
            className="mt-7 h-12 w-full rounded-xl bg-[#F0A63C] text-base font-semibold text-[#141414] shadow-[0_14px_34px_-10px_rgba(240,166,60,0.55)] transition-colors hover:bg-[#E2962B] sm:mt-6"
          >
            {isSubmitting ? "Logging in…" : "Login"}
          </Button>

          <div
            aria-hidden="true"
            className="mt-7 flex items-center gap-4 sm:gap-5"
          >
            <span className="h-px flex-1 bg-[#E3DDD2]" />
            <span className="text-sm text-[#6B6459]">or</span>
            <span className="h-px flex-1 bg-[#E3DDD2]" />
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="mt-7 h-12 w-full rounded-xl border-[#DDD5C7] bg-white text-base font-semibold text-[#141414] shadow-sm hover:bg-[#FAF8F3] sm:mt-6"
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
            {isSubmitting ? "Connecting to Google…" : "Continue with Google"}
          </Button>

          <p className="mt-6 text-center text-sm text-[#5B5347]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#141414] underline underline-offset-4 hover:text-[#8A6F52]"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right column: dark showcase panel */}
      <aside className="px-6 pb-12 sm:px-10 lg:px-0 lg:py-9 lg:pb-16 lg:pl-0 lg:pr-12 xl:pr-16">
        <div className="flex h-full flex-col rounded-3xl bg-[#2A1E13] px-6 py-9 sm:px-10 lg:px-14 lg:py-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#E9DFCE]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#E9DFCE]"
            />
            Premium creator studios
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-tight text-[#FDF9F2] sm:text-4xl">
            <span className="block">Your next shoot</span>
            <span className="block italic text-[#E7D3B8]">starts here.</span>
          </h2>

          <ul className="mt-9 mb-0 space-y-5 lg:mb-16">
            {HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-center gap-3.5 text-base text-[#EFE6D8]"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E9DFCE"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center gap-4 rounded-2xl bg-[#3C2C1D] px-4 py-4 sm:px-5">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#F0E2C4]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#141414"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 4h-5L7.8 6H4.5A1.5 1.5 0 0 0 3 7.5v10A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 19.5 6h-3.3z" />
                <circle cx="12" cy="12" r="3.4" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#FDF9F2]">
                Urban Light Photography Studio
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#CBBFAD]">
                <span className="flex items-center gap-1.5">
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#F0A63C"
                  >
                    <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9z" />
                  </svg>
                  4.8 (24)
                </span>
                <span>Dhanmondi, Dhaka</span>
                <span>$35 / hr</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {toast ? (
        <FeedbackToast
          message={toast}
          tone="error"
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </div>
  );
};

export default LoginScreen;
