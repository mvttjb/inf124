"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MOCK_PENDING,
  MODERATED_GROUPS,
} from "@/lib/requests";
import type { DecidedRequest, JoinRequest } from "@/lib/requests";

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex-shrink-0 ${color} flex items-center justify-center text-white font-bold text-lg`}
    >
      {name[0]}
    </div>
  );
}

function AvatarSm({ name, color }: { name: string; color: string }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex-shrink-0 ${color} flex items-center justify-center text-white font-bold text-sm`}
    >
      {name[0]}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Year tag colour
// ---------------------------------------------------------------------------
function YearBadge({ year }: { year: JoinRequest["year"] }) {
  const colour =
    year === "Freshman" ? "bg-green-100 text-green-700" :
      year === "Sophomore" ? "bg-blue-100 text-blue-700" :
        year === "Junior" ? "bg-violet-100 text-violet-700" :
          year === "Senior" ? "bg-amber-100 text-amber-700" :
            "bg-slate-100 text-slate-600";
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${colour}`}>
      {year}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pending request card
// ---------------------------------------------------------------------------
function PendingCard({
  req,
  onApprove,
  onDecline,
}: {
  req: JoinRequest;
  onApprove: () => void;
  onDecline: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <Avatar name={req.name} color={req.avatarColor} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{req.name}</span>
              <span className="text-xs text-slate-400 flex-shrink-0">{req.date}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600 font-medium">
                {req.university}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600 font-medium">
                {req.major}
              </span>
              <YearBadge year={req.year} />
            </div>
          </div>
        </div>

        {/* Message */}
        <blockquote className="border-l-2 border-slate-200 pl-3 text-sm text-slate-600 italic leading-relaxed bg-slate-50 py-2 pr-3 rounded-r-md">
          "{req.message}"
        </blockquote>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="bg-slate-900 hover:bg-slate-700 text-white"
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Decided item row in the sidebar
// ---------------------------------------------------------------------------
function DecidedRow({ req }: { req: DecidedRequest }) {
  return (
    <div className="flex items-center gap-3">
      <AvatarSm name={req.name} color={req.avatarColor} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{req.name}</p>
        <p className="text-[11px] text-slate-400">{req.decidedAt}</p>
      </div>
      {req.decision === "approved" ? (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 flex-shrink-0">
          APPROVED
        </span>
      ) : (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 flex-shrink-0">
          DECLINED
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function RequestsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [pending, setPending] = useState<JoinRequest[]>(MOCK_PENDING);




  // Filter pending by selected group
  const visiblePending = useMemo(
    () =>
      selectedGroupId === "all"
        ? pending
        : pending.filter((r) => r.groupId === selectedGroupId),
    [pending, selectedGroupId]
  );

  const now = new Date();
  const decidedAt = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

  const handle = (req: JoinRequest, decision: "approved" | "declined") => {
    setPending((prev) => prev.filter((r) => r.id !== req.id));
    const decidedReq: DecidedRequest = { ...req, decision, decidedAt };

  };

  return (
    <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-6 pb-12">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Manage Join Requests</h1>
          {visiblePending.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide">
              {visiblePending.length} PENDING
            </span>
          )}
        </div>

        {/* Group selector */}
        <div className="flex flex-col gap-1">
          <label htmlFor="group-select" className="text-xs font-medium text-slate-500">
            Select Study Group
          </label>
          <select
            id="group-select"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer min-w-[220px]"
          >
            <option value="all">All Groups</option>
            {MODERATED_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* ── LEFT: Pending requests ────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Pending Requests
          </h2>

          {visiblePending.length === 0 ? (
            <Card>
              <CardContent className="py-16 flex flex-col items-center gap-3 text-slate-400">
                <CheckCircle2 size={40} strokeWidth={1.5} className="text-emerald-400" />
                <p className="text-base font-medium text-slate-600">All caught up!</p>
                <p className="text-sm text-slate-400 text-center">
                  No pending requests for this group.
                </p>
              </CardContent>
            </Card>
          ) : (
            visiblePending.map((req) => (
              <PendingCard
                key={req.id}
                req={req}
                onApprove={() => handle(req, "approved")}
                onDecline={() => handle(req, "declined")}
              />
            ))
          )}
        </div>


      </div>
    </div>
  );
}
