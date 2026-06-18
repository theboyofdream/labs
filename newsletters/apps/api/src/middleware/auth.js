import { Elysia } from "elysia";
import { V3 } from "paseto";
import { db } from "../db/index.js";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

function getKey() {
  const secret = process.env.PASETO_SECRET;
  if (!secret) {
    throw new Error("PASETO_SECRET environment variable is required");
  }
  return Buffer.from(secret.padEnd(32, "x").slice(0, 32));
}

export async function verifyToken(token) {
  const key = getKey();
  const payload = await V3.decrypt(token, key);
  return payload;
}

export async function createToken(payload) {
  const key = getKey();
  const token = await V3.encrypt(
    {
      sub: payload.sub,
      role: payload.role,
      exp: payload.exp,
      origin: FRONTEND_URL,
      iat: new Date().toISOString(),
    },
    key,
  );
  return token;
}

export const authMiddleware = new Elysia().derive(
  { as: "scoped" },
  async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return { user: null };
    }

    try {
      const payload = await verifyToken(token);

      if (payload.exp && new Date(payload.exp) < new Date()) {
        return { user: null };
      }

      // Origin binding: reject if request Origin doesn't match
      const requestOrigin = request.headers.get("Origin");
      if (!requestOrigin || requestOrigin !== payload.origin) {
        return { user: null };
      }

      const session = db
        .query("SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')")
        .get(token);

      if (!session) {
        return { user: null };
      }

      const user = db
        .query("SELECT * FROM users WHERE id = ?")
        .get(payload.sub);

      if (!user) {
        return { user: null };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          avatarUrl: user.avatar_url ?? undefined,
          role: user.role,
        },
      };
    } catch {
      return { user: null };
    }
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
