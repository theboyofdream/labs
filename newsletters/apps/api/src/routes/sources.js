import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const sourceRoutes = new Elysia()
  .use(requireAuth)
  .get("/api/sources", ({ user }) => {
    const sources = db
      .query("SELECT * FROM sources WHERE user_id = ? ORDER BY created_at DESC")
      .all(user.id);
    return {
      ok: true,
      data: sources.map((s) => ({ ...s, active: Boolean(s.active) })),
    };
  })
  .post("/api/sources", async ({ user, body, error }) => {
    const { name, type, url, emailAddress } = body;

    if (!name || !type) {
      return error(400, { ok: false, error: "Name and type required" });
    }

    const id = nanoid();
    db.run(
      "INSERT INTO sources (id, user_id, name, type, url, email_address) VALUES (?, ?, ?, ?, ?, ?)",
      [id, user.id, name, type, url ?? null, emailAddress ?? null],
    );

    return { ok: true, data: { id, name, type, url, emailAddress } };
  })
  .delete("/api/sources/:id", async ({ params, user, error }) => {
    const source = db
      .query("SELECT * FROM sources WHERE id = ? AND user_id = ?")
      .get(params.id, user.id);

    if (!source) {
      return error(404, { ok: false, error: "Source not found" });
    }

    db.run("DELETE FROM sources WHERE id = ?", [params.id]);
    return { ok: true };
  })
  .patch("/api/sources/:id/toggle", async ({ params, user, error }) => {
    const source = db
      .query("SELECT * FROM sources WHERE id = ? AND user_id = ?")
      .get(params.id, user.id);

    if (!source) {
      return error(404, { ok: false, error: "Source not found" });
    }

    db.run("UPDATE sources SET active = ?, updated_at = datetime('now') WHERE id = ?", [
      source.active ? 0 : 1,
      params.id,
    ]);

    return { ok: true, data: { active: !source.active } };
  });
