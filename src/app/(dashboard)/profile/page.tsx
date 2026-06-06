"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Lock, Pencil, X, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { api } from "@/lib/api";

type AcademicYear = "Freshman" | "Sophomore" | "Junior" | "Senior" | "Grad";
const YEAR_OPTIONS: AcademicYear[] = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];

const YEAR_MAP: Record<string, string> = {
  "Freshman": "FRESHMAN",
  "Sophomore": "SOPHOMORE",
  "Junior": "JUNIOR",
  "Senior": "SENIOR",
  "Grad": "GRAD"
};

const YEAR_UNMAP: Record<string, AcademicYear> = {
  "FRESHMAN": "Freshman",
  "SOPHOMORE": "Sophomore",
  "JUNIOR": "Junior",
  "SENIOR": "Senior",
  "GRAD": "Grad"
};

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
  const { user, refreshUser, logout } = useAuth();

  // ── Profile form state ───────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [academicYear, setAcademicYear] = useState<AcademicYear>("Freshman");
  
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [myGroups, setMyGroups] = useState<any[]>([]);

  // ── Courses ──────────────────────────────────────────────────────────────
  const [newCourse, setNewCourse] = useState("");

  // Populate profile fields from context
  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
      setUniversity(user.university);
      setMajor(user.major || "");
      setAcademicYear(YEAR_UNMAP[user.year || ""] || "Freshman");
    }
  }, [user]);

  // Load user groups
  useEffect(() => {
    async function loadGroups() {
      try {
        const groups = await api.getMeGroups();
        setMyGroups(groups);
      } catch (err) {
        console.error("Failed to load user groups:", err);
      }
    }
    loadGroups();
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    try {
      const parts = fullName.trim().split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      await api.updateMe({
        firstName,
        lastName,
        university,
        major: major || undefined,
        year: YEAR_MAP[academicYear] as any,
      });

      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFullName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
      setUniversity(user.university);
      setMajor(user.major || "");
      setAcademicYear(YEAR_UNMAP[user.year || ""] || "Freshman");
      setError("");
    }
  };

  const addCourse = async () => {
    const trimmed = newCourse.trim().toUpperCase();
    if (!trimmed) return;

    try {
      await api.enrollInCourse(trimmed);
      await refreshUser();
      setNewCourse("");
    } catch (err: any) {
      alert(err.message || "Failed to enroll in course.");
    }
  };

  const removeCourse = async (code: string) => {
    try {
      await api.unenrollFromCourse(code);
      await refreshUser();
    } catch (err: any) {
      alert(err.message || "Failed to unenroll from course.");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await api.deleteMe();
        logout();
      } catch (err: any) {
        alert(err.message || "Failed to delete account.");
      }
    }
  };

  // ── Derived initials for avatar placeholder ───────────────────────────────
  const initials = useMemo(() => {
    return fullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  }, [fullName]);

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
                <div className={`w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center ${user?.avatarColor || "bg-slate-800"}`}>
                  <span className="text-white text-3xl font-bold">{initials}</span>
                </div>
              </div>

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
                {user?.courses && user.courses.map((c: any) => (
                  <span
                    key={c.code}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    {c.code}
                    <button
                      type="button"
                      onClick={() => removeCourse(c.code)}
                      className="text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {(!user?.courses || user.courses.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No courses enrolled yet.</p>
                )}
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
              {myGroups.map((g, i) => (
                <React.Fragment key={g.id}>
                  {i > 0 && <hr className="border-slate-100" />}
                  <Link
                    href={`/groups/${g.id}`}
                    className="flex items-center justify-between py-2.5 group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:underline">
                        {g.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {g.currentMembers} members · Next: {g.days.join(", ")}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </Link>
                </React.Fragment>
              ))}
              {myGroups.length === 0 && (
                <p className="text-xs text-slate-400 italic py-2">You haven't joined any groups yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-slate-900">Account Settings</h2>

              {error && (
                <div className="text-sm font-semibold text-red-600 bg-red-50 p-2.5 rounded border border-red-200 text-center">
                  {error}
                </div>
              )}

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
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className={`${inputCls} bg-slate-50 text-slate-400 cursor-not-allowed`}
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
                      required
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
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
