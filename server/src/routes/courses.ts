import { Router } from "express";
import { env } from "../config/env";

const router = Router();

// ── Curated list of common UCI departments ─────────────────────────────────
const DEPARTMENTS = [
  "COMPSCI",
  "I&C SCI",
  "IN4MATX",
  "SWE",
  "STATS",
  "MATH",
  "PHYSICS",
  "CHEM",
  "BIO SCI",
  "ECON",
  "ENGR",
  "EDUC",
  "ENGLISH",
  "HISTORY",
  "PHIL",
  "POL SCI",
  "PSYCH",
  "SOC SCI",
  "ART",
  "MUSIC",
] as const;

// ── Types ──────────────────────────────────────────────────────────────────

type CourseResult = {
  id: string;
  department: string;
  courseNumber: string;
  title: string;
};

type AnteaterCourse = {
  id: string;
  department: string;
  courseNumber: string;
  title: string;
  [key: string]: unknown;
};

type AnteaterResponse = {
  ok: boolean;
  data: {
    items: AnteaterCourse[];
    nextCursor: string | null;
  };
};

// ── GET /courses/departments ───────────────────────────────────────────────
router.get("/departments", (_req, res) => {
  res.json({ departments: DEPARTMENTS });
});

// ── GET /courses?department=COMPSCI ────────────────────────────────────────
// Returns ALL courses for a given department by paginating through the
// Anteater API cursor until there are no more results.
router.get("/", async (req, res, next) => {
  try {
    const { department } = req.query;

    if (!department || typeof department !== "string") {
      res.status(400).json({ error: "Missing required query parameter: department" });
      return;
    }

    const allCourses: CourseResult[] = [];
    let cursor: string | null = null;

    // Paginate through all results (the API caps at 100 per page).
    do {
      const url = new URL("https://anteaterapi.com/v2/rest/coursesCursor");
      url.searchParams.set("department", department);
      url.searchParams.set("take", "100");
      if (cursor) url.searchParams.set("cursor", cursor);

      const headers: Record<string, string> = {};
      if (env.anteaterApiKey) {
        headers["Authorization"] = `Bearer ${env.anteaterApiKey}`;
      }

      const response = await fetch(url.toString(), { headers });

      if (!response.ok) {
        res.status(502).json({
          error: "Anteater API returned an error",
          status: response.status,
        });
        return;
      }

      const data = (await response.json()) as AnteaterResponse;

      if (!data.ok || !data.data?.items) {
        res.status(502).json({ error: "Unexpected response shape from Anteater API" });
        return;
      }

      for (const item of data.data.items) {
        allCourses.push({
          id: item.id,
          department: item.department,
          courseNumber: item.courseNumber,
          title: item.title,
        });
      }

      cursor = data.data.nextCursor ?? null;
    } while (cursor);

    res.json({ courses: allCourses });
  } catch (err) {
    next(err);
  }
});

export default router;
