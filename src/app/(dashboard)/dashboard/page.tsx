"use client";

import React from "react";
import { X, Plus, Bookmark } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="dash-layout">
      {/* Left Column: Profile & Stats */}
      <div className="dash-left-col">
        <div className="dash-card">
          <div className="profile-header">
            <div className="profile-avatar" style={{ backgroundColor: '#2d3748' }}></div>
            <h2 className="profile-name">Lance Vu</h2>
            <p className="profile-uni">UC Irvine</p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Enrolled Courses</h3>
            <div className="course-tags">
              <span className="course-tag">ICS 31 <button><X size={12} /></button></span>
              <span className="course-tag">ICS 45J <button><X size={12} /></button></span>
              <span className="course-tag">ICS 6D <button><X size={12} /></button></span>
              <span className="course-tag">IN4MTX 124 <button><X size={12} /></button></span>
            </div>
            <button className="dash-btn-outline">
              <Plus size={16} /> Add Course
            </button>
          </div>
        </div>

        <div className="dash-card">
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Stats</h3>
          <div className="stat-row">
            <span className="stat-label">Study Hours</span>
            <span className="stat-value">24.5</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Groups Joined</span>
            <span className="stat-value">4</span>
          </div>
        </div>
      </div>

      {/* Middle Column: Main Feed */}
      <div className="dash-mid-col">
        <div className="dash-section-header">
          <h2 className="dash-section-title">My Study Groups</h2>
          <Link href="/search" className="dash-section-link">View All</Link>
        </div>

        <div className="group-cards">
          {/* Card 1 */}
          <div className="group-card">
            <div className="group-img-wrapper" style={{ backgroundColor: "#3f3f46" }}>
              <div className="live-badge">LIVE</div>
              {/* placeholder for image */}
            </div>
            <div className="group-content">
              <h3 className="group-title">Algorithms Prep</h3>
              <p className="group-subtitle">ICS 45J • 12 Members</p>
              <button className="dash-btn-solid">Enter Room</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group-card">
            <div className="group-img-wrapper" style={{ backgroundColor: "#52525b" }}>
            </div>
            <div className="group-content">
              <h3 className="group-title">Discrete Math Review</h3>
              <p className="group-subtitle">ICS 6D • 8 Members</p>
              <button className="dash-btn-outline">Details</button>
            </div>
          </div>
        </div>

        <div className="dash-section-header" style={{ marginTop: "1rem" }}>
          <h2 className="dash-section-title">Recommended for You</h2>
        </div>

        <div className="rec-cards">
          {/* Rec 1 */}
          <div className="rec-card">
            <div className="rec-header">
              <span className="rec-tag">ICS 6D</span>
              <Bookmark size={16} color="#a1a1aa" />
            </div>
            <h4 className="rec-title">Logic Sprint</h4>
            <p className="rec-desc">Deep dive into boolean algebra and proofs...</p>
            <div className="rec-footer">
              <div className="rec-avatars">
                <div className="rec-avatar"></div>
                <div className="rec-avatar"></div>
                <div className="rec-avatar"></div>
              </div>
              <span className="rec-join">JOIN</span>
            </div>
          </div>

          {/* Rec 2 */}
          <div className="rec-card">
            <div className="rec-header">
              <span className="rec-tag">ICS 45J</span>
              <Bookmark size={16} color="#a1a1aa" />
            </div>
            <h4 className="rec-title">Pointer Logic</h4>
            <p className="rec-desc">Mastering memory management and pointers...</p>
            <div className="rec-footer">
              <div className="rec-avatars">
                <div className="rec-avatar"></div>
                <div className="rec-avatar"></div>
              </div>
              <span className="rec-join">JOIN</span>
            </div>
          </div>

          {/* Rec 3 */}
          <div className="rec-card">
            <div className="rec-header">
              <span className="rec-tag">IN4MTX 124</span>
              <Bookmark size={16} color="#a1a1aa" />
            </div>
            <h4 className="rec-title">Web Dev Feedback</h4>
            <p className="rec-desc">Peer review session for React final project...</p>
            <div className="rec-footer">
              <div className="rec-avatars">
                <div className="rec-avatar"></div>
                <div className="rec-avatar"></div>
                <div className="rec-avatar"></div>
              </div>
              <span className="rec-join">JOIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Schedule */}
      <div className="dash-right-col">
        <div className="dash-card" style={{ padding: "1.25rem" }}>
          <h3 className="schedule-header">Study Schedule</h3>
          <div className="calendar-week">
            <div className="calendar-day"><span className="cal-letter">M</span><span className="cal-num">12</span></div>
            <div className="calendar-day"><span className="cal-letter">T</span><span className="cal-num">13</span></div>
            <div className="calendar-day"><span className="cal-letter">W</span><span className="cal-num active">14</span></div>
            <div className="calendar-day"><span className="cal-letter">T</span><span className="cal-num">15</span></div>
            <div className="calendar-day"><span className="cal-letter">F</span><span className="cal-num">16</span></div>
            <div className="calendar-day"><span className="cal-letter">S</span><span className="cal-num">17</span></div>
            <div className="calendar-day"><span className="cal-letter">S</span><span className="cal-num">18</span></div>
          </div>
        </div>

        <div className="dash-card" style={{ padding: "1.25rem" }}>
          <h3 className="schedule-header">Upcoming Sessions</h3>
          <div className="session-list" style={{ marginBottom: "1.5rem" }}>
            <div className="session-item">
              <div className="session-bar"></div>
              <div>
                <h4 className="session-title">Algo Midterm Review</h4>
                <p className="session-time">Today • 4:00 PM - 5:30 PM</p>
              </div>
            </div>
            <div className="session-item">
              <div className="session-bar light"></div>
              <div>
                <h4 className="session-title">Discrete Math Group</h4>
                <p className="session-time">Tomorrow • 10:00 AM</p>
              </div>
            </div>
            <div className="session-item">
              <div className="session-bar light"></div>
              <div>
                <h4 className="session-title">Web Dev Writeup</h4>
                <p className="session-time">Friday • 2:00 PM</p>
              </div>
            </div>
          </div>
          <button className="dash-btn-outline" style={{ backgroundColor: "#f4f4f5", border: "none" }}>
            View Full Schedule
          </button>
        </div>
      </div>

    </div>
  );
}
