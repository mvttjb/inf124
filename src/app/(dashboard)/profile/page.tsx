"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock, Pencil, X, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Mock profile data – replace with API fetch / auth context
// ---------------------------------------------------------------------------
const INITIAL_PROFILE = {
  fullName: "Lance Vu",
  email: "lancv2@uci.edu",
  university: "UC Irvine",
  major: "Information & Computer Science",
  academicYear: "Junior" as AcademicYear,
  avatarInitial: "L",
  avatarColor: "bg-blue-600",
};

const INITIAL_COURSES = ["ICS 31", "ICS 45J", "ICS 6D", "IN4MTX 124"];

const MY_STUDY_GROUPS = [
  { id: "2", name: "Intro to Computer Science", members: 3, nextSession: "Tuesday 10am" },
  { id: "1", name: "Algorithmic Wizards", members: 6, nextSession: "Monday 4pm" },
];

type AcademicYear = "Freshman" | "Sophomore" | "Junior" | "Senior" | "Grad";
const YEAR_OPTIONS: AcademicYear[] = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-500 mb-1">
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ProfilePage() {
  // ── Profile form state ───────────────────────────────────────────────────
  const [fullName, setFullName] = useState(INITIAL_PROFILE.fullName);
  const [email, setEmail] = useState(INITIAL_PROFILE.email);
  const [university, setUniversity] = useState(INITIAL_PROFILE.university);
  const [major, setMajor] = useState(INITIAL_PROFILE.major);
  const [academicYear, setAcademicYear] = useState<AcademicYear>(INITIAL_PROFILE.academicYear);
  const [saved, setSaved] = useState(false);

  // ── Courses ──────────────────────────────────────────────────────────────
  const [courses, setCourses] = useState<string[]>(INITIAL_COURSES);
  const [newCourse, setNewCourse] = useState("");

  // ── Avatar ───────────────────────────────────────────────────────────────
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  };

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // TODO: PATCH /api/profile
  };

  const handleCancel = () => {
    setFullName(INITIAL_PROFILE.fullName);
    setEmail(INITIAL_PROFILE.email);
    setUniversity(INITIAL_PROFILE.university);
    setMajor(INITIAL_PROFILE.major);
    setAcademicYear(INITIAL_PROFILE.academicYear);
  };

  const addCourse = () => {
    const trimmed = newCourse.trim().toUpperCase();
    if (trimmed && !courses.includes(trimmed)) {
      setCourses((prev) => [...prev, trimmed]);
    }
    setNewCourse("");
  };

  const removeCourse = (c: string) =>
    setCourses((prev) => prev.filter((x) => x !== c));

  // ── Derived initials for avatar placeholder ───────────────────────────────
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-6 pb-12">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Avatar card */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center ${
                    avatarUrl ? "" : "bg-slate-800"
                  }`}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  )}
                </div>
                {/* Edit overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <Pencil size={12} className="text-slate-600" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-slate-600 underline hover:text-slate-900 transition-colors"
              >
                Edit Photo
              </button>

              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
                <p className="text-sm text-slate-500">{university}</p>
                <p className="text-xs text-slate-400 mt-0.5">{major}</p>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-slate-900">Enrolled Courses</h2>

              <div className="flex flex-wrap gap-2">
                {courses.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeCourse(c)}
                      className="text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add course input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., ICS 53"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCourse())}
                  className="flex-1 h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
                <button
                  type="button"
                  onClick={addCourse}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <Plus size={14} className="text-slate-600" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* My Study Groups */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">My Study Groups</h2>
              {MY_STUDY_GROUPS.map((g, i) => (
                <React.Fragment key={g.id}>
                  {i > 0 && <hr className="border-slate-100" />}
                  <Link
                    href={`/groups/${g.id}`}
                    className="flex items-center justify-between py-2.5 group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:underline">
                        {g.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {g.members} members · Next: {g.nextSession}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </Link>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-slate-900">Account Settings</h2>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                    <input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* University + Major */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel htmlFor="university">University</FieldLabel>
                    <input
                      id="university"
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="major">Major</FieldLabel>
                    <input
                      id="major"
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Academic Year */}
                <div className="max-w-xs">
                  <FieldLabel htmlFor="academic-year">Academic Year</FieldLabel>
                  <select
                    id="academic-year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
                  >
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <hr className="border-slate-100" />

                {/* Change Password */}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Lock size={14} />
                    Change Password
                  </Button>
                </div>

                <hr className="border-slate-100" />

                {/* Save / Cancel */}
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  {saved && (
                    <span className="text-sm text-emerald-600 font-medium mr-auto">
                      ✓ Changes saved!
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 min-w-[120px]"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-slate-400 hover:text-red-500 hover:underline transition-colors"
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                  // TODO: DELETE /api/account
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
