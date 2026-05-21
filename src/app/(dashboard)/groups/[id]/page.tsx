"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Globe,
  Lock,
  Share2,
  FileText,
  FileImage,
  Link2,
  BookOpen,
  CheckCircle2,
  Clock,
  Users,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGroupDetail } from "@/lib/browseGroups";
import type { SharedResource } from "@/lib/browseGroups";

// ---------------------------------------------------------------------------
// Resource icon helper
// ---------------------------------------------------------------------------
function ResourceIcon({ type }: { type: SharedResource["type"] }) {
  const cls = "text-slate-500 flex-shrink-0";
  switch (type) {
    case "pdf":    return <FileText size={15} className={cls} />;
    case "slides": return <FileImage size={15} className={cls} />;
    case "link":   return <Link2 size={15} className={cls} />;
    default:       return <BookOpen size={15} className={cls} />;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const group = getGroupDetail(params.id);

  // If no group found, trigger Next.js 404
  if (!group) notFound();

  const [requestState, setRequestState] = useState<"idle" | "sent">("idle");

  const handleRequest = () => {
    setRequestState("sent");
    // TODO: POST /api/groups/:id/join
  };

  const isFull = group.currentMembers >= group.maxMembers;
  const pct = Math.round((group.currentMembers / group.maxMembers) * 100);

  // How many member avatars to show before the "+N" overflow
  const VISIBLE_AVATARS = 5;
  const overflowCount = Math.max(0, group.members.length - VISIBLE_AVATARS);

  return (
    <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-5 pb-12">

      {/* ── Back breadcrumb ─────────────────────────────────────────────── */}
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft size={16} />
        Back to Browse Groups
      </Link>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {group.courseCode}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              {group.privacy === "Public"
                ? <Globe size={12} />
                : <Lock size={12} />}
              {group.privacy} Group
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{group.title}</h1>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            <Share2 size={14} />
            Share
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* About */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">About this group</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 leading-relaxed">
              {group.description}
            </CardContent>
          </Card>

          {/* Meeting Schedule – NO map image per user request */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">Meeting Schedule</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <CalendarDays size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{group.scheduleDays}</p>
                  <p className="text-sm text-slate-500">{group.scheduleTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{group.locationName}</p>
                  {group.locationDetail && (
                    <p className="text-sm text-slate-500">{group.locationDetail}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-slate-900">
                  Members ({group.currentMembers})
                </h2>
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-900 hover:underline transition-colors"
                >
                  View all
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Stacked avatars */}
                <div className="flex -space-x-2">
                  {group.members.slice(0, VISIBLE_AVATARS).map((member) => (
                    <div
                      key={member.id}
                      title={member.name}
                      className={`w-8 h-8 rounded-full border-2 border-white ${member.avatarColor} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
                    >
                      {member.name[0]}
                    </div>
                  ))}
                  {overflowCount > 0 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold flex-shrink-0">
                      +{overflowCount}
                    </div>
                  )}
                </div>

                {/* Last active */}
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} />
                  {group.lastActive}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Group Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">Group Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-slate-100">
              {[
                { label: "Course", value: group.subject },
                { label: "Created by", value: group.createdBy },
                { label: "Date Created", value: group.dateCreated },
                {
                  label: "Member Count",
                  value: `${group.currentMembers} / ${group.maxMembers}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[55%]">{value}</span>
                </div>
              ))}

              {/* Status row */}
              <div className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-slate-500">Status</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  group.status === "Recruiting" ? "text-emerald-600" :
                  group.status === "Full" ? "text-red-500" : "text-slate-500"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    group.status === "Recruiting" ? "bg-emerald-500" :
                    group.status === "Full" ? "bg-red-400" : "bg-slate-400"
                  }`} />
                  {group.status}
                </span>
              </div>
            </CardContent>

            {/* Member progress bar */}
            <div className="px-4 pb-4">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all ${
                    isFull ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-blue-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* ── Single "Request to Join" button ── */}
              {requestState === "sent" ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-10 flex items-center justify-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                    <CheckCircle2 size={16} />
                    Request Sent
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 text-center">
                    Awaiting moderator approval
                  </p>
                </div>
              ) : isFull ? (
                <div className="flex flex-col items-center gap-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleRequest}
                  >
                    Request to Join Waitlist
                  </Button>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 text-center">
                    Group is currently full
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800"
                    onClick={handleRequest}
                  >
                    <Users size={15} className="mr-2" />
                    Request to Join
                  </Button>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 text-center">
                    Moderator approval required
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Shared Resources */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">Shared Resources</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {group.sharedResources.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <ResourceIcon type={res.type} />
                  <span className="text-xs text-slate-700 truncate">{res.name}</span>
                </button>
              ))}
              {group.sharedResources.length === 0 && (
                <p className="text-xs text-slate-400 py-2">No resources shared yet.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
