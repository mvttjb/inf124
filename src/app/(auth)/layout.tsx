import React from "react";
import { GraduationCap } from "lucide-react";
import { AuthSidebar } from "@/components/auth/AuthSidebar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AuthSidebar
        description="Join thousands of students coordinating study sessions, sharing resources, and achieving academic excellence together."
        footer={
          <div className="flex items-center gap-3 text-slate-300">
            <GraduationCap size={20} aria-hidden />
            <span className="font-medium">10,000+ Students</span>
          </div>
        }
      />

      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
