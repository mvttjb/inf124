import { Router } from "express";
import { MemberRole } from "@prisma/client";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../middleware/errorHandler";

const router = Router();

function toRequest(r: any) {
    return {
        id: r.id,
        message: r.message,
        status: r.status,
        createdAt: r.createdAt,
        user: {
        id: r.user.id,
        name: `${r.user.firstName} ${r.user.lastName}`,
        major: r.user.major,
        year: r.user.year,
        avatarColor: r.user.avatarColor,
        },
        group: {
        id: r.group.id,
        title: r.group.name,
        courseCode: r.group.course.code,
        },
    };
}

// -- GET /requests - pending requests for groups the current user owns --
router.get("/", requireAuth, async (req, res, next) => {

    try {

        const requests = await prisma.joinRequest.findMany({
        where: { status: "PENDING", group: { ownerId: req.user!.id } },
        orderBy: { createdAt: "desc" },
        include: { user: true, group: { include: { course: true } } },
        });
        res.json(requests.map(toRequest));

    } catch (err) {
        next(err);
    }
    
});

// -- POST /requests/:id/approve - owner approves -> creates the membership --
router.post("/:id/approve", requireAuth, async (req, res, next) => {

    try {
        
        const request = await prisma.joinRequest.findUnique({
        where: { id: req.params.id },
        include: { group: { include: { _count: { select: { members: true } } } } },
        });
        if (!request) throw new HttpError(404, "Request not found");
        if (request.group.ownerId !== req.user!.id) throw new HttpError(403, "You don't own this group");
        if (request.status !== "PENDING") throw new HttpError(409, "Request already handled");
        if (request.group._count.members >= request.group.maxMembers) throw new HttpError(409, "Group is full");

        // Add the member and mark the request approved together (all-or-nothing).
        await prisma.$transaction([
        prisma.groupMember.create({
            data: { groupId: request.groupId, userId: request.userId, role: MemberRole.MEMBER },
        }),
        prisma.joinRequest.update({
            where: { id: request.id },
            data: { status: "APPROVED", decidedAt: new Date() },
        }),
        ]);

        res.json({ ok: true });

    } catch (err) {
        next(err);
    }

});

// -- POST /requests/:id/decline - owner declines --
router.post("/:id/decline", requireAuth, async (req, res, next) => {

    try {

        const request = await prisma.joinRequest.findUnique({
        where: { id: req.params.id },
        include: { group: true },
        });
        if (!request) throw new HttpError(404, "Request not found");
        if (request.group.ownerId !== req.user!.id) throw new HttpError(403, "You don't own this group");
        if (request.status !== "PENDING") throw new HttpError(409, "Request already handled");

        await prisma.joinRequest.update({
        where: { id: request.id },
        data: { status: "DECLINED", decidedAt: new Date() },
        });

        res.json({ ok: true });

    } catch (err) {
        next(err);
    }
    
});

export default router;
