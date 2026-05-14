import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthSidebarHighlight = {
  icon: LucideIcon;
  label: string;
};

type AuthSidebarProps = {
  brandName?: string;
  description: string;
  highlights?: AuthSidebarHighlight[];
  footer?: React.ReactNode;
  className?: string;
};

export function AuthSidebar({
  brandName = "StudyGroup",
  description,
  highlights,
  footer,
  className,
}: AuthSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between w-[400px] bg-slate-900 text-white p-12",
        className
      )}
    >
      <div>
        <div className="text-2xl font-bold mb-6">{brandName}</div>
        <p className="text-slate-300 leading-relaxed">{description}</p>
        {highlights && highlights.length > 0 ? (
          <ul className="mt-10 space-y-4">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <item.icon size={20} aria-hidden />
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {footer != null ? <div>{footer}</div> : null}
    </aside>
  );
}
