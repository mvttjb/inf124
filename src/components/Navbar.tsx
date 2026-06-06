"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Compass, PlusCircle, MessageSquare, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/search", label: "Browse Groups", icon: <Compass size={20} /> },
  { path: "/create-group", label: "Create Group", icon: <PlusCircle size={20} /> },
  { path: "/requests", label: "Requests", icon: <MessageSquare size={20} /> },
  { path: "/profile", label: "Profile", icon: <User size={20} /> },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar (hidden on desktop) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg mr-2 shadow-sm">S</div>
          <span className="font-bold text-lg tracking-wide">StudyGroup</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Dark overlay behind the drawer (mobile only, when open) */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: slide-in drawer on mobile, static sidebar on desktop */}
      <nav
        aria-label="Main navigation"
        className={`bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800
          w-64 z-50 fixed inset-y-0 left-0 transform transition-transform duration-300 md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/dashboard")}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg mr-3 shadow-sm">S</div>
            <span className="font-bold text-lg tracking-wide">StudyGroup</span>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="md:hidden p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-blue-400" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
