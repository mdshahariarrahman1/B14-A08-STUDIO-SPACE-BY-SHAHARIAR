import { Camera, Clapperboard, Mic, Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="fixed inset-0 z-100 overflow-hidden bg-[#f5f1e9] dark:bg-[#1c1610] text-[#201a14] dark:text-[#f2eadf]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[#f1e3c9] dark:bg-[#1f1911]"
      >
        <div className="h-full w-[15%] motion-safe:animate-pulse bg-[#f5a000]" />
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[9%] top-[15%] grid h-20 w-24 rotate-[-8deg] place-items-center rounded-[26px] border border-[#e7d8c4] dark:border-[#33291d] bg-[#eee3d3] dark:bg-[#1f1911] text-[#aa967d] dark:text-[#a4987f] sm:h-32 sm:w-40"
      >
        <Camera className="size-7 stroke-[1.7] sm:size-9" />
      </div>

      <div
        aria-hidden="true"
        className="absolute right-[10%] top-[21%] grid h-20 w-24 rotate-[7deg] place-items-center rounded-[26px] border border-[#d1e0e6] dark:border-[#1f3a4c] bg-[#e1ebef] dark:bg-[#10283c] text-[#819cac] sm:h-32 sm:w-44"
      >
        <Mic className="size-7 stroke-[1.7] sm:size-9" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[16%] left-[15%] grid h-20 w-24 rotate-[7deg] place-items-center rounded-[26px] border border-[#ddd1e8] dark:border-[#3f2f52] bg-[#e9e1ef] dark:bg-[#2b2140] text-[#9a87b3] dark:text-[#c9aff2] sm:h-28 sm:w-40"
      >
        <Clapperboard className="size-7 stroke-[1.7] sm:size-9" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[15%] right-[16%] grid h-20 w-24 -rotate-6 place-items-center rounded-[26px] border border-[#d2e1d3] dark:border-[#24442e] bg-[#e3ece1] dark:bg-[#1f1911] text-[#80a286] dark:text-[#9cc5a4] sm:h-28 sm:w-40"
      >
        <Music2 className="size-7 stroke-[1.7] sm:size-9" />
      </div>

      <section
        role="status"
        aria-live="polite"
        className="absolute left-1/2 top-[23.5%] flex w-full -translate-x-1/2 flex-col items-center px-4 text-center"
      >
        <div className="relative grid size-36 place-items-center sm:size-40">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-[7px] border-[#f0e1c4] dark:border-[#33291d] shadow-[0_12px_24px_rgba(174,123,54,0.08)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-[7px] border-transparent border-r-[#f5a000] border-t-[#f5a000] motion-safe:animate-spin motion-reduce:rotate-35"
          />
          <Card className="grid size-24 place-items-center rounded-[28px] border-0 bg-[#ffebc5] dark:bg-[#3a2a12] p-0 text-[#b95505] dark:text-[#f0a63c] shadow-none ring-0 sm:size-30">
            <Camera aria-hidden="true" className="size-10 stroke-[1.9]" />
          </Card>
        </div>

        <p className="mt-16 text-xs font-semibold tracking-[0.3em] text-[#b95505] dark:text-[#f0a63c]">
          <span aria-hidden="true" className="mr-2 text-[#e17c00]">
            ●
          </span>
          LOADING
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2.5rem,6.2vw,4.25rem)] leading-[1.08] tracking-[-0.06em]">
          Setting up the{" "}
          <span className="font-serif font-normal italic text-[#bd5708] dark:text-[#f0a63c]">
            studio
          </span>
        </h1>
        <p className="mt-5 text-base text-[#65584c] dark:text-[#c9bda8] sm:text-xl">
          Hang tight, we&apos;re getting your next page ready.
        </p>
        <div aria-hidden="true" className="mt-8 flex items-center gap-2">
          <span className="size-2.5 motion-safe:animate-pulse rounded-full bg-[#f5ce7e]" />
          <span className="size-2.5 motion-safe:animate-pulse rounded-full bg-[#f4bd5f] dark:bg-[#3a2a12] [animation-delay:150ms]" />
          <span className="size-2.5 motion-safe:animate-pulse rounded-full bg-[#f5a000] [animation-delay:300ms]" />
        </div>
      </section>
    </main>
  );
}
