// requireAuth: verifies JWT, attaches req.user

import type { RequestHandler } from "express";
import { HttpError } from "./errorHandler";
import { verifyToken } from "../lib/jwt";

/** Teach TypeScript that authenticated requests carry a user */
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

/**
 * Gate for protected routes. Expects an "Authorization: Bearer <token> header,
 * verifies the JWT, and attaches req.user.
 * Responds 401 if missing/invalid"
 */
export const requireAuth: RequestHandler = (req, _res, next) => {

    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new HttpError(401, "Unauthorized"));
    }

    const token = header.slice("Bearer ".length).trim();

    try {
        const payload = verifyToken(token);
        req.user = { id: payload.userId };
        next();
    } catch {
        next(new HttpError(401, "Invalid/Expired Token"));
    }

};
