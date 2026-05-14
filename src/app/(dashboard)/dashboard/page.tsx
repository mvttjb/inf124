"use client";

import React from "react";
import { X, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudyGroupCard } from "@/components/dashboard/StudyGroupCard";
import { RecommendedGroupCard } from "@/components/dashboard/RecommendedGroupCard";
import type { RecommendedGroupCardData, StudyGroupCardData } from "@/types/dashboard";

/** Replace with account-scoped data from your API */
const MOCK_MY_STUDY_GROUPS: StudyGroupCardData[] = [
  {
    id: "1",
    title: "Algorithms Prep",
    courseCode: "ICS 45J",
    memberCount: 12,
    heroClassName: "bg-zinc-700",
    isLive: true,
    action: { label: "Enter Room", variant: "default" },
  },
  {
    id: "2",
    title: "Discrete Math Review",
    courseCode: "ICS 6D",
    memberCount: 8,
    heroClassName: "bg-zinc-600",
    action: { label: "Details", variant: "outline" },
  },
];

const MOCK_RECOMMENDED: RecommendedGroupCardData[] = [
  {
    id: "r1",
    courseCode: "ICS 6D",
    title: "Logic Sprint",
    description: "Deep dive into boolean algebra and proofs...",
    memberPreviewCount: 3,
  },
  {
    id: "r2",
    courseCode: "ICS 45J",
    title: "Pointer Logic",
    description: "Mastering memory management and pointers...",
    memberPreviewCount: 2,
  },
  {
    id: "r3",
    courseCode: "IN4MTX 124",
    title: "Web Dev Feedback",
    description: "Peer review session for React final project...",
    memberPreviewCount: 3,
  },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-8 max-w-[1440px] mx-auto w-full">
      
      {/* Left Column: Profile & Stats */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            {/* Avatar Placeholder */}
            <div className="w-20 h-20 rounded-xl bg-slate-800 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900">Alex Chen</h2>
            <p className="text-sm text-slate-500 mb-6">UC Irvine</p>

            <div className="w-full text-left">
              <h3 className="text-base font-semibold mb-3">Enrolled Courses</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  ICS 31 <button className="text-slate-400 hover:text-slate-900"><X size={12} /></button>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  ICS 45J <button className="text-slate-400 hover:text-slate-900"><X size={12} /></button>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  ICS 6D <button className="text-slate-400 hover:text-slate-900"><X size={12} /></button>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  IN4MTX 124 <button className="text-slate-400 hover:text-slate-900"><X size={12} /></button>
                </Badge>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Plus size={16} /> Add Course
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Stats</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Study Hours</span>
              <span className="text-base font-semibold text-slate-900">24.5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Groups Joined</span>
              <span className="text-base font-semibold text-slate-900">4</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Column: Main Feed */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">My Study Groups</h2>
          <Link href="/search" className="text-sm font-medium underline text-slate-900">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {MOCK_MY_STUDY_GROUPS.map((group) => (
            <StudyGroupCard key={group.id} group={group} />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 mt-2">
          <h2 className="text-xl font-semibold text-slate-900">Recommended for You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_RECOMMENDED.map((group) => (
            <RecommendedGroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>

      {/* Right Column: Schedule */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Study Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-slate-500">{day}</span>
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-md ${i === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
                    {12 + i}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex gap-3">
              <div className="w-1 bg-slate-900 rounded-full" />
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Algo Midterm Review</h4>
                <p className="text-xs text-slate-500">Today • 4:00 PM - 5:30 PM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1 bg-slate-200 rounded-full" />
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Discrete Math Group</h4>
                <p className="text-xs text-slate-500">Tomorrow • 10:00 AM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1 bg-slate-200 rounded-full" />
              <div>
                <h4 className="text-sm font-semibold mb-0.5">Web Dev Writeup</h4>
                <p className="text-xs text-slate-500">Friday • 2:00 PM</p>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full mt-2">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
