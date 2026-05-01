"use client";

import React from "react";
import { X, Plus, Bookmark } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
          {/* Card 1 */}
          <Card className="overflow-hidden">
            <div className="relative h-[140px] bg-zinc-700">
              <div className="absolute top-3 right-3 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                LIVE
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-base font-semibold mb-1">Algorithms Prep</h3>
              <p className="text-xs text-slate-500 mb-4">ICS 45J • 12 Members</p>
              <Button className="w-full">Enter Room</Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="overflow-hidden">
            <div className="relative h-[140px] bg-zinc-600"></div>
            <CardContent className="p-4">
              <h3 className="text-base font-semibold mb-1">Discrete Math Review</h3>
              <p className="text-xs text-slate-500 mb-4">ICS 6D • 8 Members</p>
              <Button variant="outline" className="w-full">Details</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4 mt-2">
          <h2 className="text-xl font-semibold text-slate-900">Recommended for You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Rec 1 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-slate-100 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">ICS 6D</span>
                <Bookmark size={16} className="text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold mb-1">Logic Sprint</h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                Deep dive into boolean algebra and proofs...
              </p>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                </div>
                <span className="text-xs font-bold text-slate-900 cursor-pointer">JOIN</span>
              </div>
            </CardContent>
          </Card>

          {/* Rec 2 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-slate-100 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">ICS 45J</span>
                <Bookmark size={16} className="text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold mb-1">Pointer Logic</h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                Mastering memory management and pointers...
              </p>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                </div>
                <span className="text-xs font-bold text-slate-900 cursor-pointer">JOIN</span>
              </div>
            </CardContent>
          </Card>

          {/* Rec 3 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-slate-100 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">IN4MTX 124</span>
                <Bookmark size={16} className="text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold mb-1">Web Dev Feedback</h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                Peer review session for React final project...
              </p>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"></div>
                </div>
                <span className="text-xs font-bold text-slate-900 cursor-pointer">JOIN</span>
              </div>
            </CardContent>
          </Card>
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
