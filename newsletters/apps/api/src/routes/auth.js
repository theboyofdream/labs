import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { authMiddleware, createToken } from "../middleware/auth.js";

export const authRoutes = new Elysia()
  .use(authMiddleware)
  .post("/api/auth/google", async ({ body, error }) => {
    const { idToken } = body;
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return error(400, { ok: false, error: "Invalid token" });
    }

    const existing = db
      .query("SELECT * FROM users WHERE email = ?")
      .get(payload.email);

    let userId;
    if (existing) {
      userId = existing.id;
      db.run("UPDATE users SET name = ?, avatar_url = ?, updated_at = datetime('now') WHERE id = ?", [
        payload.name ?? existing.email,
        payload.picture ?? null,
        userId,
      ]);
    } else {
      userId = nanoid();
      db.run(
        "INSERT INTO users (id, email, name, avatar_url, role) VALUES (?, ?, ?, ?, 'user')",
        [userId, payload.email, payload.name ?? payload.email, payload.picture ?? null],
      );
      db.run("INSERT INTO user_settings (user_id) VALUES (?)", [userId]);
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create PASETO token
    const pasetoToken = await createToken({
      sub: userId,
      role: existing?.role ?? "user",
      exp: expiresAt.toISOString(),
    });

    // Store in DB for revocation support
    db.run("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)", [
      nanoid(),
      userId,
      pasetoToken,
      expiresAt.toISOString(),
    ]);

    return {
      ok: true,
      data: {
        token: pasetoToken,
        user: {
          id: userId,
          email: payload.email,
          name: payload.name ?? undefined,
          avatarUrl: payload.picture ?? undefined,
          role: existing?.role ?? "user",
        },
      },
    };
  })
  .get("/api/auth/me", ({ user }) => {
    if (!user) {
      return { ok: false, error: "Not authenticated" };
    }
    return { ok: true, data: user };
  })
  .post("/api/auth/logout", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (token) {
      db.run("DELETE FROM sessions WHERE token = ?", [token]);
    }
    return { ok: true };
  });
