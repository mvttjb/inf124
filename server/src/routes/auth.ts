import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AcademicYear, type User } from "@prisma/client";
import { prisma } from "../db/prisma";
import { signToken } from "../lib/jwt";
import { validateBody } from "../lib/validate";
import { HttpError } from "../middleware/errorHandler";

const router = Router();

// Normalize emails, e.g. "Guest@UCI.edu" and "Guest@uci.edu" are the same
const email = z.string().email().transform((e) => e.trim().toLowerCase());

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email,
    password: z.string().min(8, "Password must be at least 8 characters"),
    major: z.string().optional(),
    year: z.nativeEnum(AcademicYear).optional(),
});

const loginSchema = z.object({
    email,
    password: z.string().min(1, "Password is required"),
});

const resetSchema = z.object({
    email,
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

/** Strip the password hash before sending a user to the client. */
function toPublicUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
}

// POST /auth/register
router.post("/register", validateBody(registerSchema), async (req, res, next) => {

    try {

        const { firstName, lastName, email, password, major, year } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new HttpError(409, "Email already registered.");

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { firstName, lastName, email, passwordHash, major, year },
        });

        const token = signToken({ userId: user.id });
        res.status(201).json({ token, user: toPublicUser(user) });

    } catch(err) {
        next(err);
    }

});

// POST /auth/login
router.post("/login", validateBody(loginSchema), async (req, res, next) => {
    
    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new HttpError(401, "Invalid email or password.");

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new HttpError(401, "Invalid email or password.");

        const token = signToken({ userId: user.id });
        res.json({ token, user: toPublicUser(user) });

    } catch(err) {
        next(err);
    }

});

// POST /auth/reset-password
router.post("/reset-password", validateBody(resetSchema), async (req, res, next) => {

    try {

        const { email, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash },
            });
        }

        // Always 200
        res.json({ ok: true });

    } catch(err) {
        next(err);
    }

});

export default router;
