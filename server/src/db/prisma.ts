import { PrismaClient } from "@prisma/client";

// Single shared Prisma client for the whole app. Reusing one instance avoids
// exhausting the database connection pool during development hot-reloads.
export const prisma = new PrismaClient();
