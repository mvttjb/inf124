import React from "react";
import { Users, Calendar, GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="auth-sidebar">
        <div className="auth-brand">
          <div className="auth-logo">StudyGroup</div>
          <p className="auth-tagline">
            Join thousands of students coordinating study sessions, sharing resources, and achieving academic excellence together.
          </p>
        </div>
        
        <div className="auth-stats">
          <div className="auth-stat-item">
            <GraduationCap className="auth-stat-icon" />
            <span>10,000+ Students</span>
          </div>
        </div>
      </div>

      {/* Right Main Content */}
      <div className="auth-main">
        {children}
      </div>
    </div>
  );
}
