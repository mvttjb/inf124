import React from "react";
import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RecommendedGroupCardData } from "@/types/dashboard";

type RecommendedGroupCardProps = {
  group: RecommendedGroupCardData;
};

export function RecommendedGroupCard({ group }: RecommendedGroupCardProps) {
  const {
    courseCode,
    title,
    description,
    memberPreviewCount = 0,
    onJoin,
    onBookmarkClick,
  } = group;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-slate-100 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">
            {courseCode}
          </span>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-900 p-0.5 rounded"
            onClick={onBookmarkClick}
            aria-label="Bookmark group"
          >
            <Bookmark size={16} />
          </button>
        </div>
        <h4 className="text-sm font-semibold mb-1">{title}</h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-1.5" aria-hidden>
            {Array.from({ length: memberPreviewCount }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white bg-zinc-300"
              />
            ))}
          </div>
          <button
            type="button"
            className="text-xs font-bold text-slate-900 cursor-pointer hover:underline"
            onClick={onJoin}
          >
            JOIN
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
