"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Compass, PlusCircle, Calendar, MessageSquare, User, LogOut } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/search", label: "Browse Groups", icon: <Compass size={20} /> },
  { path: "/create-group", label: "Create Group", icon: <PlusCircle size={20} /> },
  { path: "/availability", label: "Availability", icon: <Calendar size={20} /> },
  { path: "/requests", label: "Requests", icon: <MessageSquare size={20} /> },
  { path: "/profile", label: "Profile", icon: <User size={20} /> },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-64 h-screen bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800 transition-all duration-300">
      <div 
        className="h-16 flex items-center px-6 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => router.push("/dashboard")}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg mr-3 shadow-sm">
          S
        </div>
        <span className="font-bold text-lg tracking-wide">StudyGroup</span>
      </div>

      <ul className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
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
        <Link 
          href="/login" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
