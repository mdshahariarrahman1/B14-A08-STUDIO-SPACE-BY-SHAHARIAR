"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FooterNewsletter = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Newsletter sign-up is not connected yet.");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7">
      <label
        htmlFor="footer-newsletter-email"
        className="text-sm font-medium text-white"
      >
        Get studio news and offers
      </label>
      <div className="mt-2 flex flex-col gap-2 min-[420px]:flex-row">
        <Input
          id="footer-newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Your email address"
          className="h-12 min-w-0 rounded-full border-0 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-[#f5a000]"
        />
        <Button
          type="submit"
          className="h-12 shrink-0 rounded-full bg-[#f5a000] px-5 text-sm font-semibold text-neutral-950 hover:bg-[#e89400]"
        >
          Subscribe <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-4 text-xs text-white/60">
        {message}
      </p>
    </form>
  );
};

export default FooterNewsletter;
