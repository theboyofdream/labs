import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth.js";
import { sourceRoutes } from "./routes/sources.js";
import { articleRoutes } from "./routes/articles.js";
import { digestRoutes } from "./routes/digests.js";
import { setupCron } from "./cron/index.js";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    }),
  )
  .group("/api", (api) =>
    api
      .use(authRoutes)
      .use(sourceRoutes)
      .use(articleRoutes)
      .use(digestRoutes),
  )
  .get("/health", () => ({ ok: true }))
  .listen(process.env.PORT ?? 3001);

setupCron(app);

console.log(`API running at ${app.server?.url}`);
