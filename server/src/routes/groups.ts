import { Router } from "express";
import { z } from "zod";
import { DayOfWeek, LocationType, Privacy, MemberRole } from "@prisma/client";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../lib/validate";
import { HttpError } from "../middleware/errorHandler";

const router = Router();
const PAGE_SIZE = 9;

const DAY_LABEL: Record<DayOfWeek, string> = {
    MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun",
};

/** 
 * Shared include + mapper for the "detail" shape 
 * (GET /:id, POST, PATCH)
*/
const DETAIL_INCLUDE = {
    course: true, owner: true, meetings: true,
    members: { include: { user: true } }, resources: true,
} as const;

function toGroupDetail(g: any) {

    const days = g.meetings.map((m: any) => DAY_LABEL[m.dayOfWeek]);
    const first = g.meetings[0];
    const time = first ? (first.endTime ? `${first.startTime}-${first.endTime}` : first.startTime) : "";

    return {
        id: g.id, title: g.name, courseCode: g.course.code, subject: g.course.subject,
        privacy: g.privacy === "PRIVATE" ? "Private" : "Public",
        description: g.description,
        createdBy: `${g.owner.firstName} ${g.owner.lastName}`,
        dateCreated: g.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        currentMembers: g.members.length, maxMembers: g.maxMembers,
        status: g.members.length >= g.maxMembers ? "Full" : "Recruiting",
        scheduleDays: days.join(", "), scheduleTime: time,
        locationName: g.location, locationDetail: g.locationDetail,
        members: g.members.map((m: any) => ({ id: m.user.id, name: `${m.user.firstName} ${m.user.lastName}`, avatarColor: m.user.avatarColor })),
        sharedResources: g.resources.map((r: any) => ({ id: r.id, name: r.name, type: r.type.toLowerCase() })),
        lastActive: "Active recently",
    };


} 

// -- Schemas (writes) --
const meetingSchema = z.object({
    dayOfWeek: z.nativeEnum(DayOfWeek),
    startTime: z.string().min(1),
    endTime: z.string().optional(),
});

const createGroupSchema = z.object({
    name: z.string().min(1),
    course: z.object({
        department: z.string().min(1),
        courseNumber: z.string().min(1),
        title: z.string().min(1),
    }),
    description: z.string().optional(),
    locationType: z.nativeEnum(LocationType).optional(),
    location: z.string().optional(),
    locationDetail: z.string().optional(),
    privacy: z.nativeEnum(Privacy).optional(),
    maxMembers: z.number().int().positive().optional(),
    repeatType: z.string().optional(),
    meetings: z.array(meetingSchema).optional(),
});

const updateGroupSchema = createGroupSchema.partial().omit({ course: true });

// -- GET /groups - filter/sort/paginate groups --
router.get("/", async (req, res, next) => {

    try {

        const groups = await prisma.group.findMany({
        orderBy: { createdAt: "desc" },
        include: { course: true, meetings: true, _count: { select: { members: true } } },
        });

        let rows = groups.map((g) => {
        const days = g.meetings.map((m) => DAY_LABEL[m.dayOfWeek]);
        const time = g.meetings[0]?.startTime ?? "";
        return {
            id: g.id, title: g.name, courseCode: g.course.code, subject: g.course.subject,
            days, dayTokens: days, time,
            timeOfDay: time.includes("AM") ? "AM" : "PM",
            location: g.location, currentMembers: g._count.members, maxMembers: g.maxMembers,
        };
        });

        const { query, subject, day, timeOfDay, maxSize, openOnly, sort } = req.query;
        const q = String(query ?? "").trim().toLowerCase();
        if (q) rows = rows.filter((g) => `${g.title} ${g.courseCode} ${g.subject}`.toLowerCase().includes(q));
        if (subject && subject !== "all") rows = rows.filter((g) => g.subject === subject);
        if (day && day !== "all") rows = rows.filter((g) => g.dayTokens.includes(String(day)));
        if (timeOfDay && timeOfDay !== "all") rows = rows.filter((g) => g.timeOfDay === timeOfDay);
        if (maxSize && maxSize !== "all") rows = rows.filter((g) => g.maxMembers <= parseInt(String(maxSize), 10));
        if (openOnly === "true") rows = rows.filter((g) => g.currentMembers < g.maxMembers);

        if (sort === "most-members") rows.sort((a, b) => b.currentMembers - a.currentMembers);
        else if (sort === "fewest-members") rows.sort((a, b) => a.currentMembers - b.currentMembers);
        else if (sort === "alphabetical") rows.sort((a, b) => a.title.localeCompare(b.title));

        const total = rows.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const page = Math.min(Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1), totalPages);
        const start = (page - 1) * PAGE_SIZE;

        res.json({ groups: rows.slice(start, start + PAGE_SIZE), total, totalPages, page });

    } catch (err) {
        next(err);
    }

});

// -- GET /groups/:id - get group details --
router.get("/:id", async (req, res, next) => {

    try {

        const g = await prisma.group.findUnique({ where: { id: req.params.id }, include: DETAIL_INCLUDE });
        if (!g) throw new HttpError(404, "Group not found");
        res.json(toGroupDetail(g));

    } catch (err) {
        next(err);
    }

});

// -- POST /groups - create a new group --
router.post("/", requireAuth, validateBody(createGroupSchema), async (req, res, next) => {

    try {

        const { name, course, description, locationType, location, locationDetail,
                privacy, maxMembers, repeatType, meetings } = req.body;

        // find-or-create the Course (bridges UCI/Anteater courses into our DB)
        const code = `${course.department} ${course.courseNumber}`.trim();
        const courseRow = await prisma.course.upsert({
        where: { code },
        update: {},
        create: { code, title: course.title, subject: course.department },
        });

        const created = await prisma.group.create({
        data: {
            name, courseId: courseRow.id,
            description: description ?? "",
            locationType: locationType ?? "IN_PERSON",
            location: location ?? "", locationDetail: locationDetail ?? "",
            privacy: privacy ?? "PUBLIC",
            maxMembers: maxMembers ?? 6,
            repeatType: repeatType ?? "Every Week",
            ownerId: req.user!.id,
            meetings: meetings?.length ? { create: meetings } : undefined,
            members: { create: [{ userId: req.user!.id, role: MemberRole.OWNER }] },
        },
        include: DETAIL_INCLUDE,
        });

        res.status(201).json(toGroupDetail(created));
        
    } catch (err) {
        next(err);
    }

});

// -- PATCH /groups/:id - update a group (owner only) --
router.patch("/:id", requireAuth, validateBody(updateGroupSchema), async (req, res, next) => {

    try {

        const group = await prisma.group.findUnique({ where: { id: req.params.id } });
        if (!group) throw new HttpError(404, "Group not found");
        if (group.ownerId !== req.user!.id) throw new HttpError(403, "You don't own this group");

        const { meetings, ...fields } = req.body;
        const updated = await prisma.group.update({
        where: { id: group.id },
        data: { ...fields, ...(meetings ? { meetings: { deleteMany: {}, create: meetings } } : {}) },
        include: DETAIL_INCLUDE,
        });

        res.json(toGroupDetail(updated));

    } catch (err) {
        next(err);
    }

});

// -- DELETE /groups/:id (owner only) --
router.delete("/:id", requireAuth, async (req, res, next) => {

    try {

        const group = await prisma.group.findUnique({ where: { id: req.params.id } });
        if (!group) throw new HttpError(404, "Group not found");
        if (group.ownerId !== req.user!.id) throw new HttpError(403, "You don't own this group");

        await prisma.group.delete({ where: { id: group.id } });
        res.status(204).end();

    } catch (err) {
        next(err);
    }

});

// -- POST /groups/:id/join - join a group (if not full) --
router.post("/:id/join", requireAuth, async (req, res, next) => {

    try {

        const userId = req.user!.id;
        const group = await prisma.group.findUnique({
        where: { id: req.params.id },
        include: { _count: { select: { members: true } } },
        });
        if (!group) throw new HttpError(404, "Group not found");

        const existing = await prisma.groupMember.findUnique({
        where: { groupId_userId: { groupId: group.id, userId } },
        });
        if (existing) throw new HttpError(409, "You are already a member");
        if (group._count.members >= group.maxMembers) throw new HttpError(409, "Group is full");

        const request = await prisma.joinRequest.upsert({
        where: { groupId_userId: { groupId: group.id, userId } },
        update: { status: "PENDING", message: req.body?.message ?? "" },
        create: { groupId: group.id, userId, message: req.body?.message ?? "" },
        });

        res.status(201).json(request);

    } catch (err) {
        next(err);
    }

});

export default router;
