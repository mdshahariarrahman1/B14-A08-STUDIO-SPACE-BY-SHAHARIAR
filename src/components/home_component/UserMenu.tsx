"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  CirclePlus,
  Heart,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const MENU_LINKS = [
  {
    label: "Add New Studio",
    href: "/add-studio",
    icon: CirclePlus,
    accent: true,
  },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2, accent: false },
  { label: "My Bookings", href: "#", icon: CalendarDays, accent: false },
  { label: "Saved Wishlist", href: "#", icon: Heart, accent: false },
] as const;

const menuItemClass =
  "flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium outline-none transition-colors duration-200";

const UserMenu = ({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fallbackInitial =
    (user.name?.trim().charAt(0) || "U").toUpperCase();

  const handleLogoutClick = async () => {
    setIsOpen(false);
    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="group/user-menu flex shrink-0 items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1.5 pr-3 pl-1.5 shadow-sm outline-none transition-colors duration-200 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-[#F0A63C]/40"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Avatar
          size="lg"
          className="ring-2 ring-[#E4EDFB] *:data-[slot=avatar-fallback]:size-full"
        >
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
          <AvatarFallback className="bg-[#E4EDFB] text-sm font-semibold text-[#2C4B92]">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-32 truncate text-sm font-semibold text-[#141414]">
          {user.name ?? "User"}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl gap-0 p-1.5"
      >
        {/* Signed-in identity header */}
        <div className="px-3 pt-1.5 pb-2.5">
          <p className="text-xs font-medium text-neutral-400">Signed in as</p>
          <p className="mt-1 truncate text-base font-bold text-neutral-900">
            {user.name ?? "User"}
          </p>
          <p className="mt-0.5 truncate text-xs text-neutral-500">
            {user.email && user.email.length > 0
              ? user.email
              : "No email on file"}
          </p>
        </div>

        {MENU_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              menuItemClass,
              link.accent
                ? "text-[#E08A1E] hover:bg-[#FDF3E3] hover:text-[#C97A12]"
                : "text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <link.icon
              aria-hidden="true"
              className={cn("size-4.5 shrink-0", link.accent && "text-[#F0A63C]")}
            />
            {link.label}
          </Link>
        ))}

        <div aria-hidden="true" className="my-1.5 h-px bg-neutral-200" />

        <button
          type="button"
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className={cn(
            menuItemClass,
            "text-red-600 transition-colors hover:bg-red-50 hover:text-red-700",
          )}
        >
          <LogOut aria-hidden="true" className="size-4.5 shrink-0" />
          {isLoggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
