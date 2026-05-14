export type StudyGroupCardAction = {
  label: string;
  variant?: "default" | "outline";
  onClick?: () => void;
};

export type StudyGroupCardData = {
  id: string;
  title: string;
  courseCode: string;
  memberCount: number;
  heroClassName?: string;
  imageUrl?: string;
  isLive?: boolean;
  action: StudyGroupCardAction;
};

export type RecommendedGroupCardData = {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  memberPreviewCount?: number;
  onJoin?: () => void;
  onBookmarkClick?: () => void;
};
