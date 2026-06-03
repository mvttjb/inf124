/**
 * Seeds the database with the same data the frontend currently mocks in
 * ../src/lib/browseGroups.ts and ../src/lib/requests.ts. Running this gives the
 * API realistic data so the React app behaves exactly as it does today once the
 * mock layers are swapped for HTTP calls.
 *
 * Run with: npm run db:seed   (after prisma migrate has created the tables)
 */
import {
  PrismaClient,
  AcademicYear,
  DayOfWeek,
  MemberRole,
  Privacy,
  RequestStatus,
  ResourceType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const DAY_MAP: Record<string, DayOfWeek> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
  Sat: "SAT",
  Sun: "SUN",
};

type RawGroup = {
  id: string;
  title: string;
  courseCode: string;
  subject: string;
  days: string[];
  time: string;
  location: string;
  currentMembers: number;
  maxMembers: number;
};

const RAW_GROUPS: RawGroup[] = [
  { id: "1", title: "Algorithmic Wizards", courseCode: "CSCI301", subject: "Computer Science", days: ["Mon", "Wed"], time: "4:00 PM", location: "Library Room 402", currentMembers: 6, maxMembers: 8 },
  { id: "2", title: "Quantum Mechanics Prep", courseCode: "PHYS202", subject: "Physics", days: ["Tue", "Thu"], time: "10:00 AM", location: "Science Hall 10", currentMembers: 3, maxMembers: 5 },
  { id: "3", title: "Calculus II Workshop", courseCode: "MATH102", subject: "Mathematics", days: ["Fri"], time: "2:30 PM", location: "Student Union 2B", currentMembers: 8, maxMembers: 10 },
  { id: "4", title: "BioEthics Debate", courseCode: "PHIL210", subject: "Philosophy", days: ["Mon"], time: "6:00 PM", location: "Common Grounds Cafe", currentMembers: 4, maxMembers: 4 },
  { id: "5", title: "Data Structures Lab", courseCode: "CSCI202", subject: "Computer Science", days: ["Tue", "Thu"], time: "3:00 PM", location: "Engineering Hall 101", currentMembers: 5, maxMembers: 8 },
  { id: "6", title: "Organic Chemistry Review", courseCode: "CHEM301", subject: "Chemistry", days: ["Wed"], time: "9:00 AM", location: "Chem Building 220", currentMembers: 7, maxMembers: 10 },
  { id: "7", title: "Linear Algebra Bootcamp", courseCode: "MATH201", subject: "Mathematics", days: ["Mon", "Fri"], time: "11:00 AM", location: "Math Building 305", currentMembers: 4, maxMembers: 6 },
  { id: "8", title: "Intro to Linguistics", courseCode: "LING101", subject: "Linguistics", days: ["Thu"], time: "1:00 PM", location: "Humanities 408", currentMembers: 3, maxMembers: 8 },
  { id: "9", title: "Microeconomics Study Hall", courseCode: "ECON201", subject: "Economics", days: ["Wed", "Fri"], time: "5:00 PM", location: "Business School 102", currentMembers: 6, maxMembers: 10 },
  { id: "10", title: "Creative Writing Circle", courseCode: "ENGL215", subject: "English", days: ["Tue"], time: "7:00 PM", location: "Arts Building 110", currentMembers: 5, maxMembers: 8 },
  { id: "11", title: "Spanish Conversation Lab", courseCode: "SPAN102", subject: "Languages", days: ["Mon", "Wed"], time: "10:00 AM", location: "Language Center 201", currentMembers: 8, maxMembers: 12 },
  { id: "12", title: "Intro Psychology Review", courseCode: "PSYC101", subject: "Psychology", days: ["Fri"], time: "2:00 PM", location: "Social Sciences 320", currentMembers: 9, maxMembers: 10 },
  { id: "13", title: "Machine Learning Fundamentals", courseCode: "CSCI410", subject: "Computer Science", days: ["Tue", "Thu"], time: "6:00 PM", location: "Innovation Lab 3", currentMembers: 7, maxMembers: 10 },
  { id: "14", title: "Cell Biology Deep Dive", courseCode: "BIO310", subject: "Biology", days: ["Mon"], time: "8:00 AM", location: "Life Sciences 205", currentMembers: 5, maxMembers: 8 },
  { id: "15", title: "History of Art Survey", courseCode: "ARTH201", subject: "Art History", days: ["Wed"], time: "3:00 PM", location: "Fine Arts 101", currentMembers: 4, maxMembers: 6 },
  { id: "16", title: "Thermodynamics Prep", courseCode: "PHYS310", subject: "Physics", days: ["Tue"], time: "1:00 PM", location: "Physics Lab 220", currentMembers: 3, maxMembers: 6 },
];

const MEMBER_NAMES = [
  "Sarah M.", "James L.", "Priya K.", "Daniel W.", "Mia T.",
  "Carlos R.", "Emma S.", "Noah B.", "Lily C.", "Ethan D.",
  "Sofia G.", "Liam P.", "Ava H.", "Oliver J.", "Chloe F.",
];

const AVATAR_COLORS = [
  "bg-blue-400", "bg-violet-400", "bg-pink-400", "bg-amber-400",
  "bg-emerald-400", "bg-cyan-400", "bg-rose-400", "bg-indigo-400",
];

type RawRequest = {
  name: string;
  major: string;
  year: AcademicYear;
  message: string;
  avatarColor: string;
  groupId: string;
};

const PENDING_REQUESTS: RawRequest[] = [
  { name: "Sarah Mitchell", major: "Mathematics", year: "JUNIOR", message: "I've been struggling with multivariate integration and would love to join a dedicated group.", avatarColor: "bg-cyan-500", groupId: "3" },
  { name: "David Chen", major: "Applied Physics", year: "SENIOR", message: "Looking for a group that stays focused on mid-term prep. Available Tue/Thu after 4 PM.", avatarColor: "bg-blue-500", groupId: "3" },
  { name: "Marcus Thorne", major: "Computer Science", year: "SOPHOMORE", message: "I need help with this specific math course. Happy to share my problem set solutions.", avatarColor: "bg-emerald-500", groupId: "3" },
  { name: "Aisha Patel", major: "Computer Science", year: "FRESHMAN", message: "Just started and would love a study group. I learn best by talking through problems.", avatarColor: "bg-violet-500", groupId: "2" },
  { name: "Kevin Zhao", major: "Software Engineering", year: "FRESHMAN", message: "Looking for a consistent study group to keep me accountable.", avatarColor: "bg-amber-500", groupId: "2" },
  { name: "Riley Nguyen", major: "Information & Computer Science", year: "SOPHOMORE", message: "Took this course last year. Would love to work through the tricky problems together.", avatarColor: "bg-rose-500", groupId: "1" },
];

// Demo account the frontend's profile page is modeled on.
const DEMO_USER = {
  firstName: "Lance",
  lastName: "Vu",
  email: "lance@uci.edu",
  major: "Information & Computer Science",
  year: "JUNIOR" as AcademicYear,
  avatarColor: "bg-blue-600",
  courses: ["ICS 31", "ICS 45J", "ICS 6D", "IN4MTX 124"],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function emailFor(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z]+/g, ".")
      .replace(/^\.|\.$/g, "") + "@uci.edu"
  );
}

function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = name.split(" ");
  return { firstName, lastName: rest.join(" ") || "Student" };
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function main() {
  console.log("Clearing existing data...");
  await prisma.joinRequest.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.groupMeeting.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.group.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const defaultHash = await bcrypt.hash("password123", 10);

  // --- Courses ------------------------------------------------------------
  console.log("Seeding courses...");
  const courseByCode = new Map<string, string>();
  const allCourseCodes = new Set<string>([
    ...RAW_GROUPS.map((g) => g.courseCode),
    ...DEMO_USER.courses,
  ]);
  for (const g of RAW_GROUPS) {
    const course = await prisma.course.upsert({
      where: { code: g.courseCode },
      update: {},
      create: { code: g.courseCode, title: g.title, subject: g.subject },
    });
    courseByCode.set(g.courseCode, course.id);
  }
  // Profile-only courses that aren't tied to a seeded group.
  for (const code of DEMO_USER.courses) {
    if (!courseByCode.has(code)) {
      const course = await prisma.course.upsert({
        where: { code },
        update: {},
        create: { code, title: code, subject: "Information & Computer Science" },
      });
      courseByCode.set(code, course.id);
    }
  }

  // --- Demo user ----------------------------------------------------------
  console.log("Seeding users...");
  const demo = await prisma.user.create({
    data: {
      firstName: DEMO_USER.firstName,
      lastName: DEMO_USER.lastName,
      email: DEMO_USER.email,
      passwordHash: defaultHash,
      major: DEMO_USER.major,
      year: DEMO_USER.year,
      avatarColor: DEMO_USER.avatarColor,
      enrollments: {
        create: DEMO_USER.courses.map((code) => ({
          courseId: courseByCode.get(code)!,
        })),
      },
      availability: {
        create: [
          { dayOfWeek: "MON", startTime: "14:00", endTime: "16:00" },
          { dayOfWeek: "WED", startTime: "14:00", endTime: "16:00" },
          { dayOfWeek: "FRI", startTime: "10:00", endTime: "12:00" },
        ],
      },
    },
  });

  // --- Member users (the avatar names used across groups) -----------------
  const memberUsers = [];
  for (let i = 0; i < MEMBER_NAMES.length; i++) {
    const { firstName, lastName } = splitName(MEMBER_NAMES[i]);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: emailFor(MEMBER_NAMES[i] + i),
        passwordHash: defaultHash,
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        year: "SOPHOMORE",
      },
    });
    memberUsers.push(user);
  }

  // --- Groups -------------------------------------------------------------
  console.log("Seeding groups...");
  // Demo user owns groups 1, 2, 3 (matches MODERATED_GROUPS in the frontend).
  const demoOwnedIds = new Set(["1", "2", "3"]);
  const groupIdMap = new Map<string, string>(); // raw id -> db id

  for (const g of RAW_GROUPS) {
    const ownerIsDemo = demoOwnedIds.has(g.id);
    const owner = ownerIsDemo ? demo : memberUsers[Number(g.id) % memberUsers.length];

    // Build the member list: owner first, then fill up to currentMembers.
    const memberPool = memberUsers.filter((u) => u.id !== owner.id);
    const extraCount = Math.max(0, g.currentMembers - 1);
    const extras = memberPool.slice(0, extraCount);

    const timeOfDay = g.time.includes("AM") ? "AM" : "PM";

    const group = await prisma.group.create({
      data: {
        name: g.title,
        courseId: courseByCode.get(g.courseCode)!,
        description: `Study group for ${g.courseCode} – ${g.subject}. Join us to review lecture material, work through problem sets, and prep for exams together.`,
        location: g.location,
        privacy: g.id === "4" ? Privacy.PRIVATE : Privacy.PUBLIC,
        maxMembers: g.maxMembers,
        ownerId: owner.id,
        meetings: {
          create: g.days.map((d) => ({
            dayOfWeek: DAY_MAP[d],
            startTime: g.time,
            endTime: null,
          })),
        },
        members: {
          create: [
            { userId: owner.id, role: MemberRole.OWNER },
            ...extras.map((u) => ({ userId: u.id, role: MemberRole.MEMBER })),
          ],
        },
        resources: {
          create: [
            { name: "Course Notes.pdf", type: ResourceType.PDF },
            { name: "Practice Problems.doc", type: ResourceType.DOC },
          ],
        },
      },
    });
    groupIdMap.set(g.id, group.id);
    void timeOfDay; // timeOfDay is derivable at query time from startTime
  }

  // --- Pending join requests ---------------------------------------------
  console.log("Seeding join requests...");
  for (const r of PENDING_REQUESTS) {
    const { firstName, lastName } = splitName(r.name);
    const requester = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: emailFor(r.name),
        passwordHash: defaultHash,
        major: r.major,
        year: r.year,
        avatarColor: r.avatarColor,
      },
    });
    await prisma.joinRequest.create({
      data: {
        groupId: groupIdMap.get(r.groupId)!,
        userId: requester.id,
        message: r.message,
        status: RequestStatus.PENDING,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`  Demo login: ${DEMO_USER.email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
