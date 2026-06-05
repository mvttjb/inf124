import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";

// Builds and configures the Express application.
// Routes are mounted here; the server is started in index.ts.
export function createApp() {
  const app = express();

  // CORS: allow the React frontend origin(s) to call the API.
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );

  // Parse JSON request bodies.
  app.use(express.json());

  // Routes.
  app.use("/health", healthRouter);

  // TODO: mount feature routers here, e.g.
  app.use("/auth", authRouter);
  //   app.use("/groups", groupsRouter);
  //   app.use("/users", usersRouter);
  //   app.use("/requests", requestsRouter);

  // Fallbacks.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
