// tiny zod-validation middleware

import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

/**
 * Returns middleware that validates req.body against a zod schema.
 * Failure: responds 400 with the validation errors.
 * Success: replaces req.body with the parsed data.
 */
export function validateBody(schema: ZodSchema): RequestHandler {
    return (req, res, next) => {
        
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.flatten(),
            });
        }
        req.body = result.data;
        next();

    };
}