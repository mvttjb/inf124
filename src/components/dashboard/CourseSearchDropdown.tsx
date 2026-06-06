"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X, Loader2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
export type CourseOption = {
  id: string;
  department: string;
  courseNumber: string;
  title: string;
};

type Props = {
  onSelect: (course: CourseOption) => void;
  selectedCourse: CourseOption | null;
};

// ── Constants ──────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const DEPARTMENTS = [
  "COMPSCI",
  "I&C SCI",
  "IN4MATX",
  "SWE",
  "STATS",
  "MATH",
  "PHYSICS",
  "CHEM",
  "BIO SCI",
  "ECON",
  "ENGR",
  "EDUC",
  "ENGLISH",
  "HISTORY",
  "PHIL",
  "POL SCI",
  "PSYCH",
  "SOC SCI",
  "ART",
  "MUSIC",
];

// ── Component ──────────────────────────────────────────────────────────────
export default function CourseSearchDropdown({ onSelect, selectedCourse }: Props) {
  const [department, setDepartment] = useState("");
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all courses when department changes ────────────────────────
  useEffect(() => {
    if (!department) {
      setCourses([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`${API_BASE}/courses?department=${encodeURIComponent(department)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCourses(data.courses ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load courses");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [department]);

  // ── Selection handler ────────────────────────────────────────────────
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = courses.find((c) => c.id === e.target.value);
    if (selected) onSelect(selected);
  };

  const handleClear = () => {
    onSelect(null as unknown as CourseOption);
    setDepartment("");
    setCourses([]);
  };

  // ── Shared styles (matching the create-group form) ───────────────────
  const selectCls =
    "w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer";

  // ── If a course is already selected, show a compact chip ─────────────
  if (selectedCourse) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 shadow-sm">
          <span className="font-medium text-slate-900">
            {selectedCourse.department} {selectedCourse.courseNumber}
          </span>
          <span className="text-slate-400">–</span>
          <span className="truncate">{selectedCourse.title}</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex-shrink-0 w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Clear course selection"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  // ── Main dropdown UI ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* Department selector */}
      <div>
        <label
          htmlFor="department-select"
          className="block text-xs font-medium text-slate-600 mb-1.5"
        >
          Department
        </label>
        <div className="relative">
          <select
            id="department-select"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setCourses([]);
            }}
            className={selectCls}
          >
            <option value="" disabled>
              Select a department
            </option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Course selector (shown after picking a department) */}
      {department && (
        <div>
          <label
            htmlFor="course-select"
            className="block text-xs font-medium text-slate-600 mb-1.5"
          >
            Course
          </label>
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center gap-2 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-400 shadow-sm">
                <Loader2 size={14} className="animate-spin" />
                <span>Loading courses…</span>
              </div>
            ) : error ? (
              <div className="flex items-center h-10 rounded-md border border-red-200 bg-red-50 px-3 text-sm text-red-500 shadow-sm">
                {error}
              </div>
            ) : (
              <>
                <select
                  id="course-select"
                  value=""
                  onChange={handleCourseChange}
                  className={selectCls}
                >
                  <option value="" disabled>
                    {courses.length === 0
                      ? "No courses found"
                      : `Select a course (${courses.length} available)`}
                  </option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.department} {c.courseNumber} – {c.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
