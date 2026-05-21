export type BrowseGroup = {
  id: string;
  title: string;
  courseCode: string;
  /** Days the group meets, e.g. ["Mon", "Wed"] */
  days: string[];
  /** Human-readable meeting time, e.g. "4:00 PM" */
  time: string;
  location: string;
  currentMembers: number;
  maxMembers: number;
  /** Course subject used for the Course filter dropdown */
  subject: string;
  /** Day-of-week tokens used for the Day of Week filter */
  dayTokens: string[];
  /** "AM" | "PM" used for the Time of Day filter */
  timeOfDay: "AM" | "PM";
};

export type SortOption = "most-recent" | "most-members" | "fewest-members" | "alphabetical";

export type BrowseFilters = {
  query: string;
  subject: string;
  day: string;
  timeOfDay: string;
  maxSize: string;
  openOnly: boolean;
  sort: SortOption;
  page: number;
};
