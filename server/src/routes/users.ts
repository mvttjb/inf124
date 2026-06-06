import { Router } from "express";
import { z } from "zod";
import { AcademicYear, DayOfWeek, type User } from "@prisma/client";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../lib/validate";
import { HttpError } from "../middleware/errorHandler";

const router = Router();

const DAY_LABEL: Record<DayOfWeek, string> = {
    MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun",
};

/** Strip the password hash before returning a user. */
function toPublicUser(user: User) {
  const { passwordHash, ...rest } = user;
  return rest;
}

// Every route here is for the logged-in user (req.user.id from the token).
router.use(requireAuth);

// -- GET /users/me - get the current user's info --
router.get("/me", async (req, res, next) => {
    try {

        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            include: { enrollments: { include: { course: true } } },
        });
        if (!user) throw new HttpError(404, "User not found");

        const { passwordHash, enrollments, ...publicUser } = user;
        res.json({
            ...publicUser,
            courses: enrollments.map((e) => ({
                id: e.course.id, code: e.course.code, title: e.course.title, subject: e.course.subject,
            })),
        });

    } catch (err) {
        next(err);
    }
});

// -- PATCH /users/me - update the current user's info --
const updateUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    major: z.string().optional(),
    year: z.nativeEnum(AcademicYear).optional(),
    university: z.string().optional(),
    avatarColor: z.string().optional(),
    avatarUrl: z.string().url().optional(),
});

router.patch("/me", validateBody(updateUserSchema), async (req, res, next) => {
    
    try {
        const updated = await prisma.user.update({
            where: { id: req.user!.id },
            data: req.body,
        });
        res.json(toPublicUser(updated));

    } catch (err) {
        next(err);
    }

});

// -- DELETE /users/me - delete the current user's account --
router.delete("/me", async (req, res, next) => {

    try {
        /**
         * Remove groups this user OWNS first (no cascade on the owner relation),
         * then delete the user. Memberships/requests/availability/enrollments
         * cascade automatically via the schema.
        */
        await prisma.$transaction([
        prisma.group.deleteMany({ where: { ownerId: req.user!.id } }),
        prisma.user.delete({ where: { id: req.user!.id } }),
        ]);
        res.status(204).end();

    } catch (err) {
        next(err);
    }

});

// -- GET /users/me/groups -- groups the user is a member of --
router.get("/me/groups", async (req, res, next) => {

    try {

        const memberships = await prisma.groupMember.findMany({
            where: { userId: req.user!.id },
            include: {
                group: { include: { course: true, meetings: true, _count: { select: { members: true } } } },
            },
        });

        res.json(
            memberships.map(({ group: g, role }) => {
                const days = g.meetings.map((m) => DAY_LABEL[m.dayOfWeek]);
                const time = g.meetings[0]?.startTime ?? "";
                return {
                id: g.id, title: g.name, courseCode: g.course.code, subject: g.course.subject,
                days, time, timeOfDay: time.includes("AM") ? "AM" : "PM",
                location: g.location, currentMembers: g._count.members, maxMembers: g.maxMembers,
                role, // "OWNER" or "MEMBER" — lets the dashboard show Manage vs View
                };
            })
        );

    } catch (err) {
        next(err);
    }

});

// -- GET /users/me/availability -- get the user's saved weekly availability --
router.get("/me/availability", async (req, res, next) => {

    try {

        const slots = await prisma.availability.findMany({
            where: { userId: req.user!.id },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        });
        res.json(slots);

    } catch (err) {
        next(err);
    }

});

// -- PUT /users/me/availability -- replace the user's saved weekly availability with a new set of time slots --
const availabilitySchema = z.object({
    slots: z.array(
        z.object({
            dayOfWeek: z.nativeEnum(DayOfWeek),
            startTime: z.string().min(1),
            endTime: z.string().min(1),
        })
    ),
});

router.put("/me/availability", validateBody(availabilitySchema), async (req, res, next) => {

    try {

        const { slots } = req.body;
        await prisma.$transaction([
            prisma.availability.deleteMany({ where: { userId: req.user!.id } }),
            prisma.availability.createMany({
                data: slots.map((s: any) => ({ ...s, userId: req.user!.id })),
            }),
        ]);

        const saved = await prisma.availability.findMany({
            where: { userId: req.user!.id },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        });
        res.json(saved);

    } catch (err) {
        next(err);
    }

});

export default router;
