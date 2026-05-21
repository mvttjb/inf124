/**
 * requests.ts – mock data layer for the Manage Join Requests page.
 * Replace MOCK_PENDING / MOCK_DECIDED with real API calls when backend is ready.
 */

export type JoinRequest = {
  id: string;
  name: string;
  university: string;
  major: string;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Grad";
  message: string;
  /** Display date, e.g. "Oct 24, 2024" */
  date: string;
  avatarColor: string;
  groupId: string;
  groupName: string;
};

export type DecidedRequest = JoinRequest & {
  decision: "approved" | "declined";
  /** Short timestamp shown in sidebar, e.g. "Oct 24, 10:15 AM" */
  decidedAt: string;
};

// Groups that the current user moderates
export const MODERATED_GROUPS = [
  { id: "1", name: "Algorithmic Wizards" },
  { id: "2", name: "Intro to Computer Science" },
  { id: "3", name: "Calculus II Workshop" },
];

export const MOCK_PENDING: JoinRequest[] = [
  {
    id: "p1",
    name: "Sarah Mitchell",
    university: "UCI",
    major: "Mathematics Major",
    year: "Junior",
    message:
      "I've been struggling with multivariate integration and would love to join a dedicated group. I can contribute my notes from the last three lectures.",
    date: "Oct 24, 2024",
    avatarColor: "bg-cyan-500",
    groupId: "3",
    groupName: "Calculus II Workshop",
  },
  {
    id: "p2",
    name: "David Chen",
    university: "UCI",
    major: "Applied Physics",
    year: "Senior",
    message:
      "Looking for a group that stays focused on the mid-term prep. I'm available every Tuesday and Thursday after 4 PM.",
    date: "Oct 23, 2024",
    avatarColor: "bg-blue-500",
    groupId: "3",
    groupName: "Calculus II Workshop",
  },
  {
    id: "p3",
    name: "Marcus Thorne",
    university: "UCI",
    major: "Computer Science",
    year: "Sophomore",
    message:
      "Hi, I'm currently leading another group for CS101 but I need help with this specific math course. Happy to share my problem set solutions.",
    date: "Oct 22, 2024",
    avatarColor: "bg-emerald-500",
    groupId: "3",
    groupName: "Calculus II Workshop",
  },
  {
    id: "p4",
    name: "Aisha Patel",
    university: "UC Irvine",
    major: "Computer Science",
    year: "Freshman",
    message:
      "Just started ICS 31 and would love a study group to help me get through the first few weeks. I learn best by talking through problems.",
    date: "Oct 22, 2024",
    avatarColor: "bg-violet-500",
    groupId: "2",
    groupName: "Intro to Computer Science",
  },
  {
    id: "p5",
    name: "Kevin Zhao",
    university: "UC Irvine",
    major: "Software Engineering",
    year: "Freshman",
    message:
      "Looking for a consistent study group to keep me accountable. I've done some Python before and am happy to help others debug.",
    date: "Oct 21, 2024",
    avatarColor: "bg-amber-500",
    groupId: "2",
    groupName: "Intro to Computer Science",
  },
  {
    id: "p6",
    name: "Riley Nguyen",
    university: "UC Irvine",
    major: "Information & Computer Science",
    year: "Sophomore",
    message:
      "Took this course last year and ended up retaking it. Would love to work through the tricky algorithm problems together.",
    date: "Oct 20, 2024",
    avatarColor: "bg-rose-500",
    groupId: "1",
    groupName: "Algorithmic Wizards",
  },
];

