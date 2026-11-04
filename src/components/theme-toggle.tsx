"use client";

import type { ComponentProps } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className, ...props }: ComponentProps<typeof Button> & { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className={cn("rounded-full", className)}
      onClick={handleToggleTheme}
      {...props}
    >
      <Sun aria-hidden="true" className="size-4 dark:hidden" />
      <Moon aria-hidden="true" className="hidden size-4 dark:block" />
    </Button>
  );
}
