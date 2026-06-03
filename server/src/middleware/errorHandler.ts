import type { NextFunction, Request, Response } from "express";

/** Throw this from any route/controller to return a specific HTTP status. */
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** 404 handler for unmatched routes. */
export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

/** Central error handler. Keeps responses in a consistent { error } shape. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
