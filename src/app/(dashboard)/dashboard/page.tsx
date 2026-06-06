"use client";

import React, { useEffect, useState, useMemo } from "react";
import { X, Plus, Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudyGroupCard } from "@/components/dashboard/StudyGroupCard";
import { RecommendedGroupCard } from "@/components/dashboard/RecommendedGroupCard";
import { useAuth } from "@/components/auth/AuthContext";
import { api } from "@/lib/api";
import CourseSearchDropdown, { type CourseOption } from "@/components/dashboard/CourseSearchDropdown";

const DAY_LABEL: Record<string, string> = {
  MON: "M", TUE: "T", WED: "W", THU: "T", FRI: "F", SAT: "S", SUN: "S"
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const myGroupsData = await api.getMeGroups();
      setMyGroups(myGroupsData);

      const recRes = await api.getGroups({ page: 1, sort: "most-recent" });
      const ownGroupIds = new Set(myGroupsData.map((mg: any) => mg.id));
      const filteredRec = recRes.groups.filter((rg: any) => !ownGroupIds.has(rg.id)).slice(0, 3);
      setRecommended(filteredRec);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.courses]);

  const handleAddCourse = async (course: CourseOption) => {
    try {
      const code = `${course.department} ${course.courseNumber}`;
      await api.enrollInCourse(code);
      await refreshUser();
      setShowAddCourse(false);
    } catch (err) {
      console.error("Failed to add course:", err);
    }
  };

  const handleRemoveCourse = async (code: string) => {
    try {
      await api.unenrollFromCourse(code);
      await refreshUser();
    } catch (err) {
      console.error("Failed to remove course:", err);
    }
  };

  // Map user's groups to StudyGroupCard shape
  const mappedMyGroups = useMemo(() => {
    return myGroups.map((g) => ({
      id: g.id,
      title: g.title,
      courseCode: g.courseCode,
      memberCount: g.currentMembers,
      heroClassName: g.role === "OWNER" ? "bg-zinc-700" : "bg-zinc-600",
      isLive: false,
      action: {
        label: g.role === "OWNER" ? "Manage" : "View Details",
        variant: g.role === "OWNER" ? "default" as const : "outline" as const,
        onClick: () => router.push(`/groups/${g.id}`),
      }
    }));
  }, [myGroups, router]);

  // Map recommended groups to RecommendedGroupCard shape
  const mappedRecommended = useMemo(() => {
    return recommended.map((g) => ({
      id: g.id,
      courseCode: g.courseCode,
      title: g.title,
      description: g.description || `Study group for ${g.courseCode}`,
      memberPreviewCount: Math.min(3, g.currentMembers),
      onJoin: () => router.push(`/groups/${g.id}`),
      onBookmarkClick: () => {},
    }));
  }, [recommended, router]);

  // Get upcoming sessions from meetings
  const upcomingSessions = useMemo(() => {
    const sessions: any[] = [];
    myGroups.forEach((g) => {
      if (g.days && g.days.length > 0) {
        sessions.push({
          groupName: g.title,
          day: g.days.join(", "),
          time: g.time,
        });
      }
    });
    return sessions.slice(0, 3);
  }, [myGroups]);

  const initials = user
    ? `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase()
    : "U";

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto w-full py-20 text-center text-slate-500 font-medium">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-8 max-w-[1440px] mx-auto w-full">
      
      {/* Left Column: Profile & Stats */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            {/* Avatar Placeholder */}
            <div className={`w-20 h-20 rounded-xl ${user?.avatarColor || "bg-slate-800"} flex items-center justify-center text-white text-2xl font-bold mb-4`}>
              {initials}
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-slate-500 mb-6">{user?.university}</p>

            <div className="w-full text-left">
              <h3 className="text-base font-semibold mb-3">Enrolled Courses</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {user?.courses && user.courses.length > 0 ? (
                  user.courses.map((course: any) => (
                    <Badge key={course.code} variant="secondary" className="flex items-center gap-1">
                      {course.code}
                      <button
                        onClick={() => handleRemoveCourse(course.code)}
                        className="text-slate-400 hover:text-slate-900"
                        title="Remove Course"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No courses enrolled yet.</p>
                )}
              </div>

              {showAddCourse ? (
                <div className="mt-2">
                  <CourseSearchDropdown
                    selectedCourse={null}
                    onSelect={handleAddCourse}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs text-slate-500"
                    onClick={() => setShowAddCourse(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full gap-2" onClick={() => setShowAddCourse(true)}>
                  <Plus size={16} /> Add Course
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Stats</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Study Groups Owned</span>
              <span className="text-base font-semibold text-slate-900">
                {myGroups.filter(g => g.role === "OWNER").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Groups Joined</span>
              <span className="text-base font-semibold text-slate-900">{myGroups.length}</span>
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

        {mappedMyGroups.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
              <Users size={32} />
              <p className="text-sm font-semibold">You haven't joined any groups yet.</p>
              <Link href="/search">
                <Button variant="outline" size="sm">Browse Groups</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {mappedMyGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-4 mt-2">
          <h2 className="text-xl font-semibold text-slate-900">Recommended for You</h2>
        </div>

        {mappedRecommended.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No recommendations available at this time.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mappedRecommended.map((group) => (
              <RecommendedGroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
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
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 text-slate-900`}>
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
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-1 ${i === 0 ? 'bg-slate-900' : 'bg-slate-200'} rounded-full`} />
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5">{session.groupName}</h4>
                    <p className="text-xs text-slate-500">{session.day} • {session.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No upcoming sessions scheduled.</p>
            )}
            
            <Link href="/search" className="w-full">
              <Button variant="secondary" className="w-full mt-2">
                Find More Groups
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
