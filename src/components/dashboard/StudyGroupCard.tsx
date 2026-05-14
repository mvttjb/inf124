import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudyGroupCardData } from "@/types/dashboard";

type StudyGroupCardProps = {
  group: StudyGroupCardData;
};

export function StudyGroupCard({ group }: StudyGroupCardProps) {
  const { title, courseCode, memberCount, heroClassName, imageUrl, isLive, action } = group;
  const heroStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined;

  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "relative h-[140px] bg-cover bg-center",
          imageUrl ? undefined : heroClassName ?? "bg-zinc-600"
        )}
        style={heroStyle}
      >
        {isLive ? (
          <div className="absolute top-3 right-3 bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            LIVE
          </div>
        ) : null}
      </div>
      <CardContent className="p-4">
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-xs text-slate-500 mb-4">
          {courseCode} • {memberCount} Members
        </p>
        <Button
          variant={action.variant === "outline" ? "outline" : "default"}
          className="w-full"
          type="button"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      </CardContent>
    </Card>
  );
}
