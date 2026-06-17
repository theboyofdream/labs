import { Elysia } from "elysia";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const articleRoutes = new Elysia()
  .use(requireAuth)
  .get("/api/articles", ({ user, query }) => {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const total = db
      .query(
        `SELECT COUNT(*) as count FROM articles a
         JOIN sources s ON a.source_id = s.id
         WHERE s.user_id = ?`,
      )
      .get(user.id);

    const articles = db
      .query(
        `SELECT a.* FROM articles a
         JOIN sources s ON a.source_id = s.id
         WHERE s.user_id = ?
         ORDER BY a.published_at DESC
         LIMIT ? OFFSET ?`,
      )
      .all(user.id, pageSize, offset);

    return { ok: true, data: articles, total: total.count, page, pageSize };
  })
  .get("/api/sources/:sourceId/articles", async ({ params, user, error }) => {
    const source = db
      .query("SELECT * FROM sources WHERE id = ? AND user_id = ?")
      .get(params.sourceId, user.id);

    if (!source) {
      return error(404, { ok: false, error: "Source not found" });
    }

    const articles = db
      .query("SELECT * FROM articles WHERE source_id = ? ORDER BY published_at DESC")
      .all(params.sourceId);

    return { ok: true, data: articles };
  });
