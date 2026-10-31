"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudioCard from "./StudioCard";
import { normalizeStudioCategory } from "@/lib/studios";
import type { IStudio } from "@/type";

const PAGE_SIZE = 9;
const ALL_CATEGORIES = "All categories";

const StudioExplorer = ({
  studios,
}: {
  studios: IStudio[];
}) => {
  const categoryByKey = new Map<string, string>();
  for (const studio of studios) {
    const name = studio.category.trim().replace(/\s+/g, " ");
    const key = normalizeStudioCategory(name);
    if (key && !categoryByKey.has(key)) categoryByKey.set(key, name);
  }
  const categories = [ALL_CATEGORIES, ...categoryByKey.values()];
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [maxRate, setMaxRate] = useState("any");
  const [sortBy, setSortBy] = useState("top-rated");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const category = requestedCategory
    ? categories.find(
        (item) =>
          item !== ALL_CATEGORIES &&
          normalizeStudioCategory(item) ===
            normalizeStudioCategory(requestedCategory),
      ) ?? ALL_CATEGORIES
    : ALL_CATEGORIES;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchDraft.trim().toLowerCase());
    setPage(1);
  };

  const filteredStudios = studios
    .filter((studio) => {
      const matchesSearch =
        !search ||
        `${studio.title} ${studio.location}`.toLowerCase().includes(search);
      const matchesCategory =
        category === ALL_CATEGORIES ||
        normalizeStudioCategory(studio.category) ===
          normalizeStudioCategory(category);
      const matchesRate =
        maxRate === "any" || studio.hourlyRate <= Number(maxRate);
      return matchesSearch && matchesCategory && matchesRate;
    })
    .sort((first, second) => {
      if (sortBy === "rate-low") return first.hourlyRate - second.hourlyRate;
      if (sortBy === "rate-high") return second.hourlyRate - first.hourlyRate;
      return second.rating - first.rating;
    });

  const totalPages = Math.max(1, Math.ceil(filteredStudios.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleStudios = filteredStudios.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const firstShown = filteredStudios.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(currentPage * PAGE_SIZE, filteredStudios.length);

  const selectCategory = (nextCategory: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCategory === ALL_CATEGORIES) {
      nextSearchParams.delete("category");
    } else {
      nextSearchParams.set("category", nextCategory);
    }

    const query = nextSearchParams.toString();
    router.replace(query ? `/studios?${query}` : "/studios", { scroll: false });
    setPage(1);
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f5f0] pb-16">
      <header className="bg-[#151619] px-5 py-7 text-white sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Explore studios
          </h1>
          <p className="mt-1.5 max-w-md text-xs leading-4 text-white/70">
            Search every listed space, filter by what you are making, and
            compare hourly rates side by side.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <form
          onSubmit={handleSearch}
          className="mt-4 grid gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:grid-cols-[minmax(200px,1.6fr)_minmax(130px,1fr)_minmax(130px,1fr)_auto] sm:items-end sm:p-4"
        >
          <label className="grid gap-1.5 text-[10px] font-medium text-neutral-700">
            Search by name or location
            <Input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Cyc wall, Banani, podcast"
              className="h-9 rounded-lg border-neutral-300 text-xs"
            />
          </label>
          <label className="grid gap-1.5 text-[10px] font-medium text-neutral-700">
            Hourly rate
            <Select
              value={maxRate}
              onValueChange={(value) => {
                if (value) {
                  setMaxRate(value);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="h-9 w-full rounded-lg border-neutral-300 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="40">Up to $40 / hr</SelectItem>
                <SelectItem value="60">Up to $60 / hr</SelectItem>
                <SelectItem value="100">Up to $100 / hr</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-[10px] font-medium text-neutral-700">
            Sort by
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (value) setSortBy(value);
              }}
            >
              <SelectTrigger className="h-9 w-full rounded-lg border-neutral-300 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-rated">Top rated</SelectItem>
                <SelectItem value="rate-low">Price: low to high</SelectItem>
                <SelectItem value="rate-high">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <Button
            type="submit"
            className="h-9 rounded-lg bg-[#151619] px-4 text-xs text-white hover:bg-neutral-700"
          >
            Apply filters
          </Button>
        </form>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              variant={category === item ? "default" : "outline"}
              onClick={() => selectCategory(item)}
              aria-pressed={category === item}
              className={
                category === item
                  ? "h-7 shrink-0 rounded-full bg-[#151619] px-3 text-[10px] text-white hover:bg-neutral-700"
                  : "h-7 shrink-0 rounded-full border-neutral-300 bg-white px-3 text-[10px]"
              }
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
          <p>
            Showing {firstShown}–{lastShown} of {filteredStudios.length} studios
            {category !== ALL_CATEGORIES ? (
              <>
                {" "}in <span className="font-semibold text-neutral-800">{category}</span>
              </>
            ) : null}
          </p>
          <p>{studios.length} studios total</p>
        </div>

        {visibleStudios.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-16 text-center">
            <h2 className="font-semibold text-neutral-900">
              No studios match your filters
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Try a different search or clear some filters.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setSearchDraft("");
                setMaxRate("any");
                selectCategory(ALL_CATEGORIES);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {filteredStudios.length > PAGE_SIZE ? (
          <nav
            aria-label="Studio pages"
            className="mt-6 flex items-center justify-center gap-1.5"
          >
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="size-8 bg-white"
            >
              <ChevronLeft />
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  className={
                    pageNumber === currentPage
                      ? "size-8 bg-[#151619] text-white hover:bg-neutral-700"
                      : "size-8 bg-white"
                  }
                >
                  {pageNumber}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="size-8 bg-white"
            >
              <ChevronRight />
            </Button>
          </nav>
        ) : null}
      </div>
    </main>
  );
};

export default StudioExplorer;
