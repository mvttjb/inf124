"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BrowseGroup } from "@/types/browse";

type BrowseGroupCardProps = {
  group: BrowseGroup;
  /** Skeleton mode – renders a loading placeholder */
  loading?: false;
};

type BrowseGroupCardSkeletonProps = {
  loading: true;
};

type Props = BrowseGroupCardProps | BrowseGroupCardSkeletonProps;

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function Skeleton() {
  return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
      <div className="h-1.5 bg-slate-200 rounded-b-none" />
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start">
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
          <div className="h-4 w-14 bg-slate-200 rounded" />
        </div>
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
        <div className="h-3 w-3/5 bg-slate-100 rounded" />
        <div className="mt-auto">
          <div className="h-1.5 bg-slate-200 rounded-full mb-2" />
          <div className="h-9 bg-slate-200 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main card
// ---------------------------------------------------------------------------
export function BrowseGroupCard(props: Props) {
  if ("loading" in props && props.loading) return <Skeleton />;

  const { group } = props as BrowseGroupCardProps;
  const {
    id,
    title,
    courseCode,
    days,
    time,
    location,
    currentMembers,
    maxMembers,
  } = group;

  const pct = Math.round((currentMembers / maxMembers) * 100);
  const isFull = currentMembers >= maxMembers;

  const accentColor = isFull
    ? "bg-red-500"
    : pct >= 75
    ? "bg-amber-400"
    : "bg-blue-500";

  return (
    <Card className="flex flex-col overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {/* Thin colour accent strip at top */}
      <div className={`h-1.5 ${accentColor} rounded-t-xl`} />

      <CardContent className="p-4 flex flex-col gap-2 flex-1">
        {/* Header row */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">
            {title}
          </h3>
          <span className="flex-shrink-0 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {courseCode}
          </span>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar size={12} className="flex-shrink-0" />
          <span>
            {days.join(", ")} · {time}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={12} className="flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Members & progress */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1 text-slate-500">
              <Users size={12} />
              {currentMembers} / {maxMembers} members
            </span>
            <span
              className={`font-semibold ${
                isFull ? "text-red-500" : "text-slate-500"
              }`}
            >
              {isFull ? "Full" : `${pct}% Full`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${accentColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* CTA button */}
          {isFull ? (
            <Button variant="outline" className="w-full mt-1" size="sm" asChild>
              <Link href={`/groups/${id}`}>Waitlist Group</Link>
            </Button>
          ) : (
            <Button className="w-full mt-1" size="sm" asChild>
              <Link href={`/groups/${id}`}>View Group</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
