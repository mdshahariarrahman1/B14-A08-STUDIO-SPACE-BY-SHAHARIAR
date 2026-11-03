import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/home_component/Footer";
import NavbarPage from "@/components/home_component/Navbar";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioSpace",
  description:
    "Discover inspiring photo studios, podcast rooms, sound stages, and creative workspaces on StudioSpace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Suspense
            fallback={
              <header
                aria-label="Loading navigation"
                className="sticky top-0 z-50 h-20 border-b border-neutral-200 bg-white"
              />
            }
          >
            <NavbarPage />
          </Suspense>
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
