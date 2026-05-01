import React from "react";
import { Users, Calendar, GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden md:flex flex-col justify-between w-[400px] bg-slate-900 text-white p-12">
        <div>
          <div className="text-2xl font-bold mb-6">StudyGroup</div>
          <p className="text-slate-300 leading-relaxed">
            Join thousands of students coordinating study sessions, sharing resources, and achieving academic excellence together.
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-3 text-slate-300">
            <GraduationCap size={20} />
            <span className="font-medium">10,000+ Students</span>
          </div>
        </div>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
