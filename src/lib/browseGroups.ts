/**
 * browseGroups.ts – data layer for the Browse Groups page.
 *
 * Swap `RAW_GROUPS` with a real API call (fetch / SWR / React Query) and the
 * filter/sort/paginate helpers below will continue to work unchanged.
 */

import type { BrowseGroup, BrowseFilters, SortOption } from "@/types/browse";

// ---------------------------------------------------------------------------
// Raw data (replace this array with your some type of UCI API Response
// ---------------------------------------------------------------------------
export const RAW_GROUPS: BrowseGroup[] = [
  {
    id: "1",
    title: "Algorithmic Wizards",
    courseCode: "CSCI301",
    subject: "Computer Science",
    days: ["Mon", "Wed"],
    dayTokens: ["Mon", "Wed"],
    time: "4:00 PM",
    timeOfDay: "PM",
    location: "Library Room 402",
    currentMembers: 6,
    maxMembers: 8,
  },
  {
    id: "2",
    title: "Quantum Mechanics Prep",
    courseCode: "PHYS202",
    subject: "Physics",
    days: ["Tue", "Thu"],
    dayTokens: ["Tue", "Thu"],
    time: "10:00 AM",
    timeOfDay: "AM",
    location: "Science Hall 10",
    currentMembers: 3,
    maxMembers: 5,
  },
  {
    id: "3",
    title: "Calculus II Workshop",
    courseCode: "MATH102",
    subject: "Mathematics",
    days: ["Fri"],
    dayTokens: ["Fri"],
    time: "2:30 PM",
    timeOfDay: "PM",
    location: "Student Union 2B",
    currentMembers: 8,
    maxMembers: 10,
  },
  {
    id: "4",
    title: "BioEthics Debate",
    courseCode: "PHIL210",
    subject: "Philosophy",
    days: ["Mon"],
    dayTokens: ["Mon"],
    time: "6:00 PM",
    timeOfDay: "PM",
    location: "Common Grounds Cafe",
    currentMembers: 4,
    maxMembers: 4,
  },
  {
    id: "5",
    title: "Data Structures Lab",
    courseCode: "CSCI202",
    subject: "Computer Science",
    days: ["Tue", "Thu"],
    dayTokens: ["Tue", "Thu"],
    time: "3:00 PM",
    timeOfDay: "PM",
    location: "Engineering Hall 101",
    currentMembers: 5,
    maxMembers: 8,
  },
  {
    id: "6",
    title: "Organic Chemistry Review",
    courseCode: "CHEM301",
    subject: "Chemistry",
    days: ["Wed"],
    dayTokens: ["Wed"],
    time: "9:00 AM",
    timeOfDay: "AM",
    location: "Chem Building 220",
    currentMembers: 7,
    maxMembers: 10,
  },
  {
    id: "7",
    title: "Linear Algebra Bootcamp",
    courseCode: "MATH201",
    subject: "Mathematics",
    days: ["Mon", "Fri"],
    dayTokens: ["Mon", "Fri"],
    time: "11:00 AM",
    timeOfDay: "AM",
    location: "Math Building 305",
    currentMembers: 4,
    maxMembers: 6,
  },
  {
    id: "8",
    title: "Intro to Linguistics",
    courseCode: "LING101",
    subject: "Linguistics",
    days: ["Thu"],
    dayTokens: ["Thu"],
    time: "1:00 PM",
    timeOfDay: "PM",
    location: "Humanities 408",
    currentMembers: 3,
    maxMembers: 8,
  },
  {
    id: "9",
    title: "Microeconomics Study Hall",
    courseCode: "ECON201",
    subject: "Economics",
    days: ["Wed", "Fri"],
    dayTokens: ["Wed", "Fri"],
    time: "5:00 PM",
    timeOfDay: "PM",
    location: "Business School 102",
    currentMembers: 6,
    maxMembers: 10,
  },
  {
    id: "10",
    title: "Creative Writing Circle",
    courseCode: "ENGL215",
    subject: "English",
    days: ["Tue"],
    dayTokens: ["Tue"],
    time: "7:00 PM",
    timeOfDay: "PM",
    location: "Arts Building 110",
    currentMembers: 5,
    maxMembers: 8,
  },
  {
    id: "11",
    title: "Spanish Conversation Lab",
    courseCode: "SPAN102",
    subject: "Languages",
    days: ["Mon", "Wed"],
    dayTokens: ["Mon", "Wed"],
    time: "10:00 AM",
    timeOfDay: "AM",
    location: "Language Center 201",
    currentMembers: 8,
    maxMembers: 12,
  },
  {
    id: "12",
    title: "Intro Psychology Review",
    courseCode: "PSYC101",
    subject: "Psychology",
    days: ["Fri"],
    dayTokens: ["Fri"],
    time: "2:00 PM",
    timeOfDay: "PM",
    location: "Social Sciences 320",
    currentMembers: 9,
    maxMembers: 10,
  },
  {
    id: "13",
    title: "Machine Learning Fundamentals",
    courseCode: "CSCI410",
    subject: "Computer Science",
    days: ["Tue", "Thu"],
    dayTokens: ["Tue", "Thu"],
    time: "6:00 PM",
    timeOfDay: "PM",
    location: "Innovation Lab 3",
    currentMembers: 7,
    maxMembers: 10,
  },
  {
    id: "14",
    title: "Cell Biology Deep Dive",
    courseCode: "BIO310",
    subject: "Biology",
    days: ["Mon"],
    dayTokens: ["Mon"],
    time: "8:00 AM",
    timeOfDay: "AM",
    location: "Life Sciences 205",
    currentMembers: 5,
    maxMembers: 8,
  },
  {
    id: "15",
    title: "History of Art Survey",
    courseCode: "ARTH201",
    subject: "Art History",
    days: ["Wed"],
    dayTokens: ["Wed"],
    time: "3:00 PM",
    timeOfDay: "PM",
    location: "Fine Arts 101",
    currentMembers: 4,
    maxMembers: 6,
  },
  {
    id: "16",
    title: "Thermodynamics Prep",
    courseCode: "PHYS310",
    subject: "Physics",
    days: ["Tue"],
    dayTokens: ["Tue"],
    time: "1:00 PM",
    timeOfDay: "PM",
    location: "Physics Lab 220",
    currentMembers: 3,
    maxMembers: 6,
  },
];

// ---------------------------------------------------------------------------
// Derived filter options (computed from data so they stay in sync)
// ---------------------------------------------------------------------------
export const SUBJECTS = Array.from(new Set(RAW_GROUPS.map((g) => g.subject))).sort();
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const PAGE_SIZE = 9;

// ---------------------------------------------------------------------------
// Filtering, sorting, and pagination helpers
// ---------------------------------------------------------------------------
function matchesFilters(group: BrowseGroup, filters: BrowseFilters): boolean {
  const q = filters.query.trim().toLowerCase();
  if (q) {
    const haystack = `${group.title} ${group.courseCode} ${group.subject}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.subject && filters.subject !== "all") {
    if (group.subject !== filters.subject) return false;
  }
  if (filters.day && filters.day !== "all") {
    if (!group.dayTokens.includes(filters.day)) return false;
  }
  if (filters.timeOfDay && filters.timeOfDay !== "all") {
    if (group.timeOfDay !== filters.timeOfDay) return false;
  }
  if (filters.maxSize && filters.maxSize !== "all") {
    const size = parseInt(filters.maxSize, 10);
    if (group.maxMembers > size) return false;
  }
  if (filters.openOnly) {
    if (group.currentMembers >= group.maxMembers) return false;
  }
  return true;
}

function sortGroups(groups: BrowseGroup[], sort: SortOption): BrowseGroup[] {
  return [...groups].sort((a, b) => {
    switch (sort) {
      case "most-members":
        return b.currentMembers - a.currentMembers;
      case "fewest-members":
        return a.currentMembers - b.currentMembers;
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "most-recent":
      default:
        return parseInt(b.id) - parseInt(a.id);
    }
  });
}

export type PaginatedResult = {
  groups: BrowseGroup[];
  total: number;
  totalPages: number;
  page: number;
};


export function queryGroups(filters: BrowseFilters): PaginatedResult {
  const filtered = RAW_GROUPS.filter((g) => matchesFilters(g, filters));
  const sorted = sortGroups(filtered, filters.sort);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const groups = sorted.slice(start, start + PAGE_SIZE);
  return { groups, total, totalPages, page };
}

// ---------------------------------------------------------------------------
// Group detail data (one record per group id)
// Replace with a real API fetch: GET /api/groups/:id
// ---------------------------------------------------------------------------
export type GroupMember = {
  id: string;
  name: string;
  /** bg-* tailwind colour class used as avatar placeholder */
  avatarColor: string;
};

export type SharedResource = {
  id: string;
  name: string;
  type: "doc" | "pdf" | "slides" | "link";
};

export type GroupDetail = {
  id: string;
  title: string;
  courseCode: string;
  subject: string;
  privacy: "Public" | "Private";
  description: string;
  createdBy: string;
  dateCreated: string;
  currentMembers: number;
  maxMembers: number;
  status: "Recruiting" | "Full" | "Closed";
  /** Schedule display strings */
  scheduleDays: string;
  scheduleTime: string;
  locationName: string;
  locationDetail: string;
  members: GroupMember[];
  sharedResources: SharedResource[];
  lastActive: string;
};

const AVATAR_COLORS = [
  "bg-blue-400", "bg-violet-400", "bg-pink-400", "bg-amber-400",
  "bg-emerald-400", "bg-cyan-400", "bg-rose-400", "bg-indigo-400",
  "bg-teal-400", "bg-orange-400", "bg-lime-400", "bg-fuchsia-400",
];

function makeMembers(count: number, names: string[]): GroupMember[] {
  return names.slice(0, count).map((name, i) => ({
    id: String(i + 1),
    name,
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }));
}

const NAMES = [
  "Sarah M.", "James L.", "Priya K.", "Daniel W.", "Mia T.",
  "Carlos R.", "Emma S.", "Noah B.", "Lily C.", "Ethan D.",
  "Sofia G.", "Liam P.", "Ava H.", "Oliver J.", "Chloe F.",
];

export const GROUP_DETAILS: Record<string, GroupDetail> = {
  "1": {
    id: "1", title: "Algorithmic Wizards", courseCode: "CS161",
    subject: "Computer Science", privacy: "Public",
    description: "We are a focused group of CS students working through advanced algorithm design — sorting, graph traversal, dynamic programming, and NP-completeness. Our sessions are problem-set driven with short lecture reviews.",
    createdBy: "Sarah QU.", dateCreated: "Jan 15, 2025",
    currentMembers: 6, maxMembers: 8, status: "Recruiting",
    scheduleDays: "Mondays & Wednesdays", scheduleTime: "4:00 PM – 5:30 PM",
    locationName: "Library Room 402", locationDetail: "Quiet Zone, 4th Floor",
    members: makeMembers(6, NAMES), sharedResources: [
      { id: "r1", name: "Algorithm Cheat Sheet.pdf", type: "pdf" },
      { id: "r2", name: "Week 3 Slides.pdf", type: "slides" },
    ],
    lastActive: "Active 1 hour ago",
  },
  "2": {
    id: "2", title: "Intro to Computer Science", courseCode: "ICS 31",
    subject: "Physics", privacy: "Public",
    description: "Deep dive into undergraduate quantum mechanics — wave functions, the Schrödinger equation, operators, and measurement. We work through past exam problems and textbook derivations together.",
    createdBy: "Steven L.", dateCreated: "Feb 3, 2025",
    currentMembers: 3, maxMembers: 5, status: "Recruiting",
    scheduleDays: "Tuesdays & Thursdays", scheduleTime: "10:00 AM – 11:30 AM",
    locationName: "Science Hall, Room 10", locationDetail: "Ground Floor, North Wing",
    members: makeMembers(3, NAMES.slice(1)), sharedResources: [
      { id: "r1", name: "QM Formula Sheet.pdf", type: "pdf" },
      { id: "r2", name: "Practice Midterm 2024.pdf", type: "doc" },
    ],
    lastActive: "Active 3 hours ago",
  },
  "3": {
    id: "3", title: "Calculus II Workshop", courseCode: "MATH2B",
    subject: "Mathematics", privacy: "Public",
    description: "Weekly workshop for Calculus II covering integration techniques, series and sequences, and multivariable calculus intro. We pair up on problem sets and do quick concept reviews.",
    createdBy: "Priya K.", dateCreated: "Jan 22, 2025",
    currentMembers: 8, maxMembers: 10, status: "Recruiting",
    scheduleDays: "Fridays", scheduleTime: "2:30 PM – 4:00 PM",
    locationName: "Student Union 2B", locationDetail: "Second Floor, East Side",
    members: makeMembers(8, NAMES), sharedResources: [
      { id: "r1", name: "Integration Techniques.pdf", type: "pdf" },
      { id: "r2", name: "Series Convergence Notes.doc", type: "doc" },
      { id: "r3", name: "Homework Solutions Wk4.pdf", type: "pdf" },
    ],
    lastActive: "Active 30 min ago",
  },
  "4": {
    id: "4", title: "BioEthics Debate", courseCode: "PHIL210",
    subject: "Philosophy", privacy: "Private",
    description: "A discussion-based group exploring bioethical dilemmas — from genetic editing to end-of-life care. We read primary texts and debate real-world cases in a structured Socratic format.",
    createdBy: "Daniel W.", dateCreated: "Mar 5, 2025",
    currentMembers: 4, maxMembers: 4, status: "Full",
    scheduleDays: "Mondays", scheduleTime: "6:00 PM – 7:30 PM",
    locationName: "Common Grounds Cafe", locationDetail: "Reservations under 'BioEthics'",
    members: makeMembers(4, NAMES.slice(3)), sharedResources: [
      { id: "r1", name: "Beauchamp & Childress Ch.4.pdf", type: "pdf" },
    ],
    lastActive: "Active yesterday",
  },
  "5": {
    id: "5", title: "Data Structures Lab", courseCode: "CSCI202",
    subject: "Computer Science", privacy: "Public",
    description: "Hands-on practice with linked lists, stacks, queues, trees, heaps, and hash tables. We code together in Python and C++, reviewing lecture slides and completing lab challenges.",
    createdBy: "Mia T.", dateCreated: "Jan 10, 2025",
    currentMembers: 5, maxMembers: 8, status: "Recruiting",
    scheduleDays: "Tuesdays & Thursdays", scheduleTime: "3:00 PM – 4:30 PM",
    locationName: "Engineering Hall 101", locationDetail: "First Floor, Computer Lab",
    members: makeMembers(5, NAMES), sharedResources: [
      { id: "r1", name: "DS Reference Sheet.pdf", type: "pdf" },
      { id: "r2", name: "Lab 3 Starter Code", type: "link" },
    ],
    lastActive: "Active 2 hours ago",
  },
  "6": {
    id: "6", title: "Organic Chemistry Review", courseCode: "CHEM301",
    subject: "Chemistry", privacy: "Public",
    description: "We cover reaction mechanisms, stereochemistry, and spectroscopy. Each session targets the hardest concepts from that week's lecture using practice problems and whiteboard walkthroughs.",
    createdBy: "Carlos R.", dateCreated: "Feb 18, 2025",
    currentMembers: 7, maxMembers: 10, status: "Recruiting",
    scheduleDays: "Wednesdays", scheduleTime: "9:00 AM – 10:30 AM",
    locationName: "Chem Building 220", locationDetail: "Second Floor Study Room",
    members: makeMembers(7, NAMES), sharedResources: [
      { id: "r1", name: "Reaction Mechanism Map.pdf", type: "pdf" },
      { id: "r2", name: "Spectroscopy Reference.slides", type: "slides" },
    ],
    lastActive: "Active 4 hours ago",
  },
};

// Provide minimal detail records for groups 7-16 so the page never 404s
for (const g of RAW_GROUPS) {
  if (!GROUP_DETAILS[g.id]) {
    GROUP_DETAILS[g.id] = {
      id: g.id, title: g.title, courseCode: g.courseCode,
      subject: g.subject, privacy: "Public",
      description: `Study group for ${g.courseCode} – ${g.subject}. Join us to review lecture material, work through problem sets, and prepare for exams together.`,
      createdBy: NAMES[parseInt(g.id) % NAMES.length],
      dateCreated: "Spring 2025",
      currentMembers: g.currentMembers, maxMembers: g.maxMembers,
      status: g.currentMembers >= g.maxMembers ? "Full" : "Recruiting",
      scheduleDays: g.days.join(", "),
      scheduleTime: g.time,
      locationName: g.location,
      locationDetail: "",
      members: makeMembers(g.currentMembers, NAMES),
      sharedResources: [
        { id: "r1", name: "Course Notes.pdf", type: "pdf" },
        { id: "r2", name: "Practice Problems.doc", type: "doc" },
      ],
      lastActive: "Active recently",
    };
  }
}

/** Look up a single group by id. Replace with fetch('/api/groups/:id') when backend is ready. */
export function getGroupDetail(id: string): GroupDetail | null {
  return GROUP_DETAILS[id] ?? null;
}

