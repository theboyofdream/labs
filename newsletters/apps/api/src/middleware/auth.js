import { Elysia } from "elysia";
import { db } from "../db/index.js";

export const authMiddleware = new Elysia().derive(
  { as: "scoped" },
  async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return { user: null };
    }

    const session = db
      .query(
        `SELECT s.*, u.id as uid, u.email, u.name, u.avatar_url, u.role
         FROM sessions s JOIN users u ON s.user_id = u.id
         WHERE s.token = ? AND s.expires_at > datetime('now')`,
      )
      .get(token);

    if (!session) {
      return { user: null };
    }

    return {
      user: {
        id: session.uid,
        email: session.email,
        name: session.name ?? undefined,
        avatarUrl: session.avatar_url ?? undefined,
        role: session.role,
      },
    };
  },
);

export const requireAuth = new Elysia()
  .use(authMiddleware)
  .guard({
    beforeHandle({ user, error }) {
      if (!user) {
        return error(401, { ok: false, error: "Unauthorized" });
      }
    },
  });
