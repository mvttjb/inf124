"use client";

import React, { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowseGroupCard } from "@/components/browse/BrowseGroupCard";
import {
  DAYS,
  PAGE_SIZE,
  SUBJECTS,
  queryGroups,
} from "@/lib/browseGroups";
import type { BrowseFilters, SortOption } from "@/types/browse";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "most-recent", label: "Most Recent" },
  { value: "most-members", label: "Most Members" },
  { value: "fewest-members", label: "Fewest Members" },
  { value: "alphabetical", label: "Alphabetical" },
];

const SIZE_OPTIONS = [
  { value: "all", label: "Any Size" },
  { value: "5", label: "Up to 5" },
  { value: "8", label: "Up to 8" },
  { value: "10", label: "Up to 10" },
  { value: "15", label: "Up to 15" },
];

const DEFAULT_FILTERS: BrowseFilters = {
  query: "",
  subject: "all",
  day: "all",
  timeOfDay: "all",
  maxSize: "all",
  openOnly: false,
  sort: "most-recent",
  page: 1,
};

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------
function SelectFilter({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-500">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors
        ${
          active
            ? "bg-slate-900 text-white shadow"
            : disabled
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function BrowseGroupsPage() {
  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);
  const deferredFilters = useDeferredValue(filters);

  // Query is pure client-side for now; swap with useSWR / React Query + API
  const { groups, total, totalPages, page } = useMemo(
    () => queryGroups(deferredFilters),
    [deferredFilters]
  );

  const isStale = deferredFilters !== filters;

  const setFilter = useCallback(
    <K extends keyof BrowseFilters>(key: K, value: BrowseFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    []
  );

  const setPage = useCallback((p: number) => {
    setFilters((prev) => ({ ...prev, page: p }));
  }, []);

  // Build smart page range: always show first, last, current ±1, with "…"
  const pageRange = useMemo(() => {
    if (totalPages <= 1) return [1];
    const set = new Set([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages));
    const sorted = Array.from(set).sort((a, b) => a - b);
    const result: (number | "…")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
      result.push(sorted[i]);
    }
    return result;
  }, [page, totalPages]);

  const subjectOptions = useMemo(
    () => [{ value: "all", label: "All Subjects" }, ...SUBJECTS.map((s) => ({ value: s, label: s }))],
    []
  );
  const dayOptions = useMemo(
    () => [{ value: "all", label: "Any Day" }, ...DAYS.map((d) => ({ value: d, label: d }))],
    []
  );
  const timeOptions = [
    { value: "all", label: "Any Time" },
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-slate-900">Browse Groups</h1>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          id="browse-search"
          type="search"
          placeholder="Search by course name, code, or keyword"
          value={filters.query}
          onChange={(e) => setFilter("query", e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-end gap-4">
        <SelectFilter
          id="filter-subject"
          label="Course"
          value={filters.subject}
          onChange={(v) => setFilter("subject", v)}
          options={subjectOptions}
        />
        <SelectFilter
          id="filter-day"
          label="Day of Week"
          value={filters.day}
          onChange={(v) => setFilter("day", v)}
          options={dayOptions}
        />
        <SelectFilter
          id="filter-time"
          label="Time of Day"
          value={filters.timeOfDay}
          onChange={(v) => setFilter("timeOfDay", v)}
          options={timeOptions}
        />
        <SelectFilter
          id="filter-size"
          label="Group Size"
          value={filters.maxSize}
          onChange={(v) => setFilter("maxSize", v)}
          options={SIZE_OPTIONS}
        />

        {/* Open-only toggle */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Availability</span>
          <label
            htmlFor="filter-open"
            className="h-9 flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700"
          >
            <input
              id="filter-open"
              type="checkbox"
              checked={filters.openOnly}
              onChange={(e) => setFilter("openOnly", e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 accent-slate-900"
            />
            Open Groups
          </label>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 flex items-center gap-1.5"
          onClick={() => setFilters(DEFAULT_FILTERS)}
        >
          <SlidersHorizontal size={14} />
          Reset
        </Button>
      </div>

      <hr className="border-slate-200" />

      {/* Results meta + sort */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-900">
            {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
            {Math.min(page * PAGE_SIZE, total)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-900">{total}</span> groups
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-sm text-slate-500 font-medium"
          >
            Sort By
          </label>
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(e) => setFilter("sort", e.target.value as SortOption)}
            className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer font-semibold"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-150 ${
          isStale ? "opacity-50" : "opacity-100"
        }`}
      >
        {groups.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Search size={40} strokeWidth={1.5} />
            <p className="text-base font-medium">No groups match your filters.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          groups.map((group) => (
            <BrowseGroupCard key={group.id} group={group} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2 pb-4">
          <PaginationButton
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={16} />
          </PaginationButton>

          {pageRange.map((item, i) =>
            item === "…" ? (
              <span key={`ellipsis-${i}`} className="w-9 text-center text-slate-400 text-sm">
                …
              </span>
            ) : (
              <PaginationButton
                key={item}
                active={item === page}
                onClick={() => setPage(item as number)}
              >
                {item}
              </PaginationButton>
            )
          )}

          <PaginationButton
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={16} />
          </PaginationButton>
        </div>
      )}
    </div>
  );
}
