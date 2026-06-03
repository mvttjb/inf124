import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// Liveness check + verifies the database connection. Returns 200 if healthy, otherwise an error status.
router.get("/", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    next(err);
  }
});

export default router;
