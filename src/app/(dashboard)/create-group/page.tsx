"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Info,
  CalendarDays,
  MapPin,
  Settings2,
  Building2,
  Minus,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = (typeof DAYS)[number];

const COURSES = [
  "CSCI301 – Algorithms",
  "PHYS202 – Quantum Mechanics",
  "MATH102 – Calculus II",
  "PHIL210 – BioEthics",
  "CSCI202 – Data Structures",
  "CHEM301 – Organic Chemistry",
  "ECON201 – Microeconomics",
  "ENGL215 – Creative Writing",
];

const REPEAT_OPTIONS = [
  "Every Week",
  "Every Other Week",
  "Once",
  "Custom",
];

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">{icon}</span>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Field label
// ---------------------------------------------------------------------------
function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-600 mb-1.5">
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CreateGroupPage() {
  // ── Basic Info ──────────────────────────────────────────────────────────
  const [groupName, setGroupName] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");

  // ── Schedule ─────────────────────────────────────────────────────────────
  const [activeDays, setActiveDays] = useState<Set<Day>>(new Set(["Mon", "Wed", "Fri"]));
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [repeat, setRepeat] = useState("Every Week");

  // ── Location ─────────────────────────────────────────────────────────────
  const [locationType, setLocationType] = useState<"in-person" | "virtual">("in-person");
  const [meetingPoint, setMeetingPoint] = useState("");

  // ── Settings ─────────────────────────────────────────────────────────────
  const [maxMembers, setMaxMembers] = useState(6);
  const [privacy, setPrivacy] = useState<"open" | "private">("open");

  // ── Helpers ──────────────────────────────────────────────────────────────
  const toggleDay = (day: Day) => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to API
    alert("Create Group submitted! (API integration pending)");
  };

  // ── Input classes ─────────────────────────────────────────────────────────
  const inputCls =
    "w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20";
  const selectCls =
    "w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer";

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Study Group</h1>
        <p className="text-sm text-slate-500 mt-1">
          Organize a new group to coordinate your campus learning sessions.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex flex-col gap-5">
        {/* ── Basic Info ───────────────────────────────────────────────── */}
        <Section icon={<Info size={18} />} title="Basic Info">
          <div>
            <FieldLabel htmlFor="group-name">Group Name</FieldLabel>
            <input
              id="group-name"
              type="text"
              placeholder="e.g., Midterm Smashers"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <FieldLabel htmlFor="course-select">Course</FieldLabel>
            <select
              id="course-select"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className={selectCls}
            >
              <option value="" disabled>Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <textarea
              id="description"
              rows={4}
              placeholder="Briefly describe what your group aims to achieve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
        </Section>

        {/* ── Schedule ─────────────────────────────────────────────────── */}
        <Section icon={<CalendarDays size={18} />} title="Schedule">
          <div>
            <FieldLabel>Active Days</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = activeDays.has(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="from-time">From</FieldLabel>
              <input
                id="from-time"
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel htmlFor="to-time">To</FieldLabel>
              <input
                id="to-time"
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="repeat">Repeat</FieldLabel>
            <select
              id="repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className={selectCls}
            >
              {REPEAT_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </Section>

        {/* ── Location ─────────────────────────────────────────────────── */}
        <Section icon={<MapPin size={18} />} title="Location">
          {/* Tab toggle */}
          <div className="inline-flex rounded-md border border-slate-200 overflow-hidden w-fit">
            {(["in-person", "virtual"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLocationType(type)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
                  locationType === type
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type === "in-person" ? "In-person" : "Virtual"}
              </button>
            ))}
          </div>

          <div>
            <FieldLabel htmlFor="meeting-point">
              Meeting {locationType === "in-person" ? "Point" : "Link"}
            </FieldLabel>
            <div className="relative">
              <Building2
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="meeting-point"
                type={locationType === "virtual" ? "url" : "text"}
                placeholder={
                  locationType === "in-person"
                    ? "Central Library, Floor 3, Booth A"
                    : "https://zoom.us/j/..."
                }
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className={`${inputCls} pl-8`}
              />
            </div>
          </div>
        </Section>

        {/* ── Settings ─────────────────────────────────────────────────── */}
        <Section icon={<Settings2 size={18} />} title="Settings">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Max members counter */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Max Members</FieldLabel>
              <div className="flex items-center gap-0 border border-slate-200 rounded-md overflow-hidden shadow-sm w-fit">
                <button
                  type="button"
                  onClick={() => setMaxMembers((n) => Math.max(2, n - 1))}
                  className="w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-200"
                >
                  <Minus size={14} />
                </button>
                <span className="w-14 text-center text-sm font-semibold text-slate-900 tabular-nums">
                  {maxMembers}
                </span>
                <button
                  type="button"
                  onClick={() => setMaxMembers((n) => Math.min(50, n + 1))}
                  className="w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors border-l border-slate-200"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Privacy type */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Privacy Type</FieldLabel>
              <div className="flex flex-col gap-2 mt-0.5">
                {(["open", "private"] as const).map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 select-none"
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={type}
                      checked={privacy === type}
                      onChange={() => setPrivacy(type)}
                      className="accent-slate-900 w-4 h-4"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold bg-slate-900 hover:bg-slate-800"
          >
            Create Group
          </Button>
          <Link
            href="/dashboard"
            className="text-center text-xs text-slate-500 hover:text-slate-700 hover:underline transition-colors"
          >
            Cancel and Return to Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}
